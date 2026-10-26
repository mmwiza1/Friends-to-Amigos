package com.friendstoamigos.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.Voice;
import android.speech.tts.UtteranceProgressListener;
import android.os.Build;
import android.content.res.Configuration;
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
        web.getSettings().setAllowFileAccessFromFileURLs(false);
        web.getSettings().setAllowUniversalAccessFromFileURLs(false);
        web.setWebViewClient(new WebViewClient(){
            @Override public boolean shouldOverrideUrlLoading(WebView view, String url){return !url.startsWith("file:///android_asset/");}
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
                speech.setLanguage(new Locale("es","ES"));
                speech.setOnUtteranceProgressListener(new UtteranceProgressListener(){
                    @Override public void onStart(String id){speechResult(id,true);}
                    @Override public void onDone(String id){}
                    @Override public void onError(String id){speechResult(id,false);}
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
            @JavascriptInterface public void exportAnswerReports(String json){exportJsonDocument(json,"friends-to-amigos-answer-reports.json");}
        },"AndroidSpeech");
        web.loadUrl("file:///android_asset/index.html");
        web.requestApplyInsets();
    }
    private void exportJsonDocument(String json,String filename){runOnUiThread(()->{
        exportData=json;
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
        getWindow().setStatusBarColor(background);getWindow().setNavigationBarColor(background);
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        int appearance=View.SYSTEM_UI_FLAG_LAYOUT_STABLE|View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN|View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION;
        if(!dark)appearance|=View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR|View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        if(Build.VERSION.SDK_INT>=30)getWindow().setDecorFitsSystemWindows(false);
        getWindow().getDecorView().setSystemUiVisibility(appearance);
        if(Build.VERSION.SDK_INT>=28){WindowManager.LayoutParams params=getWindow().getAttributes();params.layoutInDisplayCutoutMode=WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;getWindow().setAttributes(params);}
        // CSS owns all safe-area padding. Never also pad this WebView.
        web.setOnApplyWindowInsetsListener((view,insets)->{
            if(Build.VERSION.SDK_INT>=30){
                android.graphics.Insets bars=insets.getInsets(WindowInsets.Type.systemBars()|WindowInsets.Type.displayCutout());
                insetTop=bars.top;insetBottom=bars.bottom;insetLeft=bars.left;insetRight=bars.right;
                imeBottom=insets.getInsets(WindowInsets.Type.ime()).bottom;
                keyboardVisible=insets.isVisible(WindowInsets.Type.ime())&&imeBottom>0;
            }else{
                insetTop=Math.max(insets.getStableInsetTop(),insets.getSystemWindowInsetTop());
                insetBottom=insets.getStableInsetBottom();insetLeft=Math.max(insets.getStableInsetLeft(),insets.getSystemWindowInsetLeft());insetRight=Math.max(insets.getStableInsetRight(),insets.getSystemWindowInsetRight());
                if(Build.VERSION.SDK_INT>=28&&insets.getDisplayCutout()!=null){android.view.DisplayCutout cutout=insets.getDisplayCutout();insetTop=Math.max(insetTop,cutout.getSafeInsetTop());insetBottom=Math.max(insetBottom,cutout.getSafeInsetBottom());insetLeft=Math.max(insetLeft,cutout.getSafeInsetLeft());insetRight=Math.max(insetRight,cutout.getSafeInsetRight());}
                int bottom=insets.getSystemWindowInsetBottom();
                keyboardVisible=NativeInsets.isKeyboard(bottom,insetBottom,getResources().getDisplayMetrics().density);
                imeBottom=keyboardVisible?bottom:0;
            }
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
    private String exportData;
    @Override protected void onActivityResult(int request,int result,Intent data){
        super.onActivityResult(request,result,data);
        if(request==10 && fileCallback!=null){fileCallback.onReceiveValue(result==RESULT_OK&&data!=null?new Uri[]{data.getData()}:null);fileCallback=null;}
        if(request==11 && result==RESULT_OK && data!=null && exportData!=null){
            try(java.io.OutputStream stream=getContentResolver().openOutputStream(data.getData())){stream.write(exportData.getBytes(java.nio.charset.StandardCharsets.UTF_8));}
            catch(Exception error){Toast.makeText(this,"Could not export progress.",Toast.LENGTH_LONG).show();}
            exportData=null;
        }
    }
    private void handleBack(){
        if(backPending)return;backPending=true;
        web.evaluateJavascript("Boolean(window.FriendsToAmigos && window.FriendsToAmigos.handleBack())",result->{backPending=false;if(!NativePolicy.handled(result))moveTaskToBack(true);});
    }
    @Override public void onBackPressed(){handleBack();}
    @Override protected void onPause(){if(speech!=null)speech.stop();web.evaluateJavascript("window.dispatchEvent(new Event('fta-pause'))",null);web.onPause();web.pauseTimers();super.onPause();}
    @Override protected void onResume(){super.onResume();if(web!=null){web.onResume();web.resumeTimers();web.evaluateJavascript("window.dispatchEvent(new Event('fta-resume'))",null);}}
    @Override protected void onDestroy(){if(speech!=null){speech.stop();speech.shutdown();}web.destroy();super.onDestroy();}
}
