package com.friendstoamigos.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.Voice;
import android.speech.tts.UtteranceProgressListener;
import android.os.Build;
import android.content.res.Configuration;
import android.view.WindowInsetsController;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import android.view.WindowInsets;
import android.view.View;
import android.view.WindowManager;
import android.graphics.Rect;
import org.json.JSONObject;
import java.util.Comparator;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import android.webkit.JsResult;
import android.webkit.ValueCallback;
import android.net.Uri;
import android.content.Intent;
import android.widget.Toast;
import java.util.Locale;

public class MainActivity extends Activity {
    private WebView web;
    private TextToSpeech speech;
    private volatile boolean speechReady;
    private ValueCallback<Uri[]> fileCallback;
    private boolean backPending;
    private int insetTop,insetBottom,insetLeft,insetRight,imeBottom,legacyFullHeight;
    private boolean keyboardVisible;
    private float cssScale;
    @Override public void onCreate(Bundle saved) {
        super.onCreate(saved);
        web = new WebView(this);
        cssScale=getResources().getDisplayMetrics().density;
        applyAppearance();
        if(Build.VERSION.SDK_INT>=33)getOnBackInvokedDispatcher().registerOnBackInvokedCallback(android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT,this::handleBack);
        setContentView(web);
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setAllowFileAccess(true);
        denyFileUrlAccess();
        web.setWebViewClient(new WebViewClient(){
            @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){return !request.getUrl().toString().startsWith("file:///android_asset/");}
            @Override public void onPageFinished(WebView view,String url){view.requestApplyInsets();publishInsets();}
            @Override public void onScaleChanged(WebView view,float oldScale,float newScale){cssScale=NativeInsets.validScale(newScale,getResources().getDisplayMetrics().density);publishInsets();}
        });
        web.setWebChromeClient(new WebChromeClient(){
            @Override public boolean onJsConfirm(WebView view,String url,String message,JsResult result){
                new AlertDialog.Builder(MainActivity.this).setMessage(message)
                    .setPositiveButton("OK",(dialog,which)->result.confirm())
                    .setNegativeButton("Cancel",(dialog,which)->result.cancel())
                    .setOnCancelListener(dialog->result.cancel()).show();
                return true;
            }
            @Override public boolean onShowFileChooser(WebView view,ValueCallback<Uri[]> callback,FileChooserParams params){
                if(fileCallback!=null)fileCallback.onReceiveValue(null);
                fileCallback=callback;
                Intent intent=new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("application/json");
                startActivityForResult(intent,10);
                return true;
            }
        });
        speech=new TextToSpeech(this,status->{
            if(status==TextToSpeech.SUCCESS){
                speech.setLanguage(Locale.forLanguageTag("es-ES"));
                speech.setOnUtteranceProgressListener(new UtteranceProgressListener(){
                    @Override public void onStart(String id){speechResult(id,true);}
                    @Override public void onDone(String id){}
                    @SuppressWarnings("deprecation") @Override public void onError(String id){speechResult(id,false);}
                    @Override public void onError(String id,int code){speechResult(id,false);}
                    @Override public void onStop(String id,boolean interrupted){speechResult(id,false);}
                });
                // Prefer a deterministic installed voice; never require a network voice.
                if(speech.getVoices()!=null){
                    Voice voice=speech.getVoices().stream()
                        .filter(v->"es".equals(v.getLocale().getLanguage()) && "ES".equals(v.getLocale().getCountry()) && !v.isNetworkConnectionRequired() && !v.getFeatures().contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED))
                        .sorted(Comparator.comparing(Voice::getName)).findFirst().orElse(null);
                    speechReady=voice!=null && speech.setVoice(voice)==TextToSpeech.SUCCESS;
                }
                speech.setSpeechRate(.85f);
            }
        });
        web.addJavascriptInterface(new Object(){
            @JavascriptInterface public boolean isReady(){return speechReady;}
            @JavascriptInterface public void stop(){runOnUiThread(()->{if(speech!=null)speech.stop();});}
            @JavascriptInterface public void speak(String text){speakText(text,.85f);}
            @JavascriptInterface public void speakAtRate(String text,double rate){speakText(text,NativePolicy.rate(rate));}
            @JavascriptInterface public void listen(String text,double rate,String id){runOnUiThread(()->{
                if(!speechReady){speechResult(id,false);return;}
                speech.setSpeechRate(NativePolicy.rate(rate));
                if(speech.speak(text,TextToSpeech.QUEUE_FLUSH,null,id)==TextToSpeech.ERROR)speechResult(id,false);
            });}
            @JavascriptInterface public void openExternal(String url){
                if(!NativePolicy.externalUrl(url))return;
                runOnUiThread(()->{
                    try { startActivity(new Intent(Intent.ACTION_VIEW,Uri.parse(url)).addCategory(Intent.CATEGORY_BROWSABLE)); }
                    catch(android.content.ActivityNotFoundException error){Toast.makeText(MainActivity.this,"Install a browser to open this recommendation.",Toast.LENGTH_LONG).show();}
                });
            }
            @JavascriptInterface public void exportProgress(String json){exportJsonDocument(json,"friends-to-amigos-progress.json");}
            @JavascriptInterface public void exportDiagnostics(String json){exportJsonDocument(json,"friends-to-amigos-beta-diagnostics.json");}
            @JavascriptInterface public void exportAnswerReports(String json){exportJsonDocument(json,"friends-to-amigos-answer-reports.json");}
        },"AndroidSpeech");
        web.loadUrl("file:///android_asset/index.html");
        web.requestApplyInsets();
    }
    // The JSON waiting for a destination is staged in private cache, not a field,
    // so it survives the activity being recreated or killed while the picker is open.
    private File pendingExport(){return new File(getCacheDir(),"pending-export.json");}
    private void exportJsonDocument(String json,String filename){runOnUiThread(()->{
        try(OutputStream stream=new FileOutputStream(pendingExport())){stream.write(json.getBytes(StandardCharsets.UTF_8));}
        catch(Exception error){Toast.makeText(MainActivity.this,"Could not prepare the export.",Toast.LENGTH_LONG).show();return;}
        Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("application/json").putExtra(Intent.EXTRA_TITLE,filename);
        startActivityForResult(intent,11);
    });}
    private void speakText(String text,float rate){runOnUiThread(()->{
        if(speechReady){speech.setSpeechRate(rate);speech.speak(text,TextToSpeech.QUEUE_FLUSH,null,"spanish");}
        else Toast.makeText(MainActivity.this,"Install an offline Spanish (Spain) voice in Android speech settings.",Toast.LENGTH_LONG).show();
    });}
    private void speechResult(String id,boolean started){
        if(id==null||!id.startsWith("listen-"))return;
        runOnUiThread(()->{if(web!=null&&!isDestroyed())web.evaluateJavascript("window.FriendsToAmigosSpeechResult && window.FriendsToAmigosSpeechResult("+JSONObject.quote(id)+","+started+")",null);});
    }
    private void applyAppearance(){
        boolean dark=(getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK)==Configuration.UI_MODE_NIGHT_YES;
        int background=getColor(R.color.app_background);web.setBackgroundColor(background);
        // adjustResize comes from the manifest; Android 15+ always draws edge-to-edge with
        // transparent bars, so bar colours are only set where the platform still uses them.
        if(Build.VERSION.SDK_INT<35)legacyBarColours(background);
        if(Build.VERSION.SDK_INT>=30){
            // Android 15+ is always edge-to-edge; the call is only needed on 11-14.
            if(Build.VERSION.SDK_INT<35)legacyEdgeToEdge();
            // The decor view queues this until it is attached, so it is safe before setContentView.
            WindowInsetsController controller=getWindow().getInsetsController();
            int light=WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS|WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS;
            if(controller!=null)controller.setSystemBarsAppearance(dark?0:light,light);
        }else legacySystemUi(dark);
        if(Build.VERSION.SDK_INT>=28){WindowManager.LayoutParams params=getWindow().getAttributes();params.layoutInDisplayCutoutMode=WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;getWindow().setAttributes(params);}
        // CSS owns all safe-area padding. Never also pad this WebView.
        web.setOnApplyWindowInsetsListener((view,insets)->{
            if(Build.VERSION.SDK_INT>=30){
                android.graphics.Insets bars=insets.getInsets(WindowInsets.Type.systemBars()|WindowInsets.Type.displayCutout());
                insetTop=bars.top;insetBottom=bars.bottom;insetLeft=bars.left;insetRight=bars.right;
                imeBottom=insets.getInsets(WindowInsets.Type.ime()).bottom;
                keyboardVisible=insets.isVisible(WindowInsets.Type.ime())&&imeBottom>0;
            }else legacyInsets(insets);
            view.post(this::publishInsets);
            return insets;
        });
        web.addOnLayoutChangeListener((view,left,top,right,bottom,oldLeft,oldTop,oldRight,oldBottom)->publishInsets());
        if(Build.VERSION.SDK_INT<30)web.getViewTreeObserver().addOnGlobalLayoutListener(()->{
            // Older WebViews report IME insets inconsistently. Resize/visible-frame
            // evidence supplements those insets without applying native padding.
            legacyFullHeight=Math.max(legacyFullHeight,web.getHeight());
            Rect visible=new Rect();web.getWindowVisibleDisplayFrame(visible);
            int[] location=new int[2];web.getLocationOnScreen(location);
            int overlap=Math.max(0,location[1]+web.getHeight()-visible.bottom);
            int removed=Math.max(0,legacyFullHeight-web.getHeight());
            // Recompute from the visible frame, rather than retaining a previous
            // IME height after the keyboard closes without a new inset callback.
            int keyboardHeight=overlap+removed;
            keyboardVisible=NativeInsets.isKeyboard(keyboardHeight,insetBottom,getResources().getDisplayMetrics().density);
            imeBottom=keyboardVisible?keyboardHeight:0;
            publishInsets();
        });
    }
    // Android 8-10 only: these inset getters and system UI flags are the only APIs available there.
    @SuppressWarnings("deprecation")
    private void legacyInsets(WindowInsets insets){
        insetTop=Math.max(insets.getStableInsetTop(),insets.getSystemWindowInsetTop());
        insetBottom=insets.getStableInsetBottom();insetLeft=Math.max(insets.getStableInsetLeft(),insets.getSystemWindowInsetLeft());insetRight=Math.max(insets.getStableInsetRight(),insets.getSystemWindowInsetRight());
        if(Build.VERSION.SDK_INT>=28&&insets.getDisplayCutout()!=null){android.view.DisplayCutout cutout=insets.getDisplayCutout();insetTop=Math.max(insetTop,cutout.getSafeInsetTop());insetBottom=Math.max(insetBottom,cutout.getSafeInsetBottom());insetLeft=Math.max(insetLeft,cutout.getSafeInsetLeft());insetRight=Math.max(insetRight,cutout.getSafeInsetRight());}
        int bottom=insets.getSystemWindowInsetBottom();
        keyboardVisible=NativeInsets.isKeyboard(bottom,insetBottom,getResources().getDisplayMetrics().density);
        imeBottom=keyboardVisible?bottom:0;
    }
    @SuppressWarnings("deprecation")
    private void legacySystemUi(boolean dark){
        int appearance=View.SYSTEM_UI_FLAG_LAYOUT_STABLE|View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN|View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION;
        if(!dark)appearance|=View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR|View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        getWindow().getDecorView().setSystemUiVisibility(appearance);
    }
    // Called only on Android 11-14 (API 30-34), inside the SDK_INT check in applyAppearance.
    @android.annotation.TargetApi(Build.VERSION_CODES.R)
    @SuppressWarnings("deprecation")
    private void legacyEdgeToEdge(){getWindow().setDecorFitsSystemWindows(false);}
    // Already false by default; kept explicit so file pages can never read other files or origins.
    @SuppressWarnings("deprecation")
    private void denyFileUrlAccess(){web.getSettings().setAllowFileAccessFromFileURLs(false);web.getSettings().setAllowUniversalAccessFromFileURLs(false);}
    // Android 14 and lower: bars are drawn with these colours. Ignored from Android 15.
    @SuppressWarnings("deprecation")
    private void legacyBarColours(int background){getWindow().setStatusBarColor(background);getWindow().setNavigationBarColor(background);}
    private void publishInsets(){
        if(web==null||web.getWidth()==0||web.getHeight()==0||isDestroyed())return;
        int height;
        if(Build.VERSION.SDK_INT>=30)height=getWindowManager().getCurrentWindowMetrics().getBounds().height();
        else{legacyFullHeight=Math.max(legacyFullHeight,web.getHeight());height=legacyFullHeight;}
        int[] location=new int[2];web.getLocationInWindow(location);
        int overlap=keyboardVisible?NativeInsets.keyboardOverlap(imeBottom,height,location[1]+web.getHeight()):0;
        float scale=NativeInsets.validScale(cssScale,getResources().getDisplayMetrics().density);
        String values=NativeInsets.cssPixels(insetTop,scale)+","+NativeInsets.cssPixels(insetBottom,scale)+","+NativeInsets.cssPixels(insetLeft,scale)+","+NativeInsets.cssPixels(insetRight,scale)+","+keyboardVisible+","+NativeInsets.cssPixels(overlap,scale);
        web.evaluateJavascript("window.FriendsToAmigosInsets && window.FriendsToAmigosInsets("+values+")",null);
    }
    @Override protected void onActivityResult(int request,int result,Intent data){
        super.onActivityResult(request,result,data);
        if(request==10){
            if(fileCallback!=null){fileCallback.onReceiveValue(result==RESULT_OK&&data!=null?new Uri[]{data.getData()}:null);fileCallback=null;}
            // A recreated activity has a fresh page with no waiting file input; say so rather than drop the file silently.
            else if(result==RESULT_OK)Toast.makeText(this,"The app restarted while the file picker was open. Please choose the file again.",Toast.LENGTH_LONG).show();
        }
        if(request==11){
            File pending=pendingExport();
            if(result==RESULT_OK && data!=null && data.getData()!=null && pending.isFile()){
                try(InputStream in=new FileInputStream(pending);OutputStream out=getContentResolver().openOutputStream(data.getData())){
                    if(out==null)throw new java.io.IOException("No output stream");
                    byte[] buffer=new byte[16384];int read;while((read=in.read(buffer))>0)out.write(buffer,0,read);
                }
                catch(Exception error){Toast.makeText(this,"Could not export progress.",Toast.LENGTH_LONG).show();}
            }
            if(pending.exists() && !pending.delete())pending.deleteOnExit();
        }
    }
    // Rotation, folding and window resizing are handled in place (see the manifest), so
    // the page, any in-progress answer and an open file picker are not reloaded.
    @Override public void onConfigurationChanged(Configuration config){
        super.onConfigurationChanged(config);
        legacyFullHeight=0;
        if(web!=null){web.requestApplyInsets();web.post(this::publishInsets);}
    }
    private void handleBack(){
        if(backPending)return;backPending=true;
        web.evaluateJavascript("Boolean(window.FriendsToAmigos && window.FriendsToAmigos.handleBack())",result->{backPending=false;if(!NativePolicy.handled(result))moveTaskToBack(true);});
    }
    @SuppressWarnings("deprecation") // Pre-API 33 only; newer versions use OnBackInvokedDispatcher.
    @Override public void onBackPressed(){handleBack();}
    @Override protected void onPause(){if(speech!=null)speech.stop();if(web!=null){web.evaluateJavascript("window.dispatchEvent(new Event('fta-pause'))",null);web.onPause();web.pauseTimers();}super.onPause();}
    @Override protected void onResume(){super.onResume();if(web!=null){web.onResume();web.resumeTimers();web.evaluateJavascript("window.dispatchEvent(new Event('fta-resume'))",null);}}
    @Override protected void onDestroy(){if(speech!=null){speech.stop();speech.shutdown();}if(web!=null){web.destroy();web=null;}super.onDestroy();}
}
