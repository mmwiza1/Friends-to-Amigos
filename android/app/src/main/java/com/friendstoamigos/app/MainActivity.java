package com.friendstoamigos.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.Voice;
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
    @Override public void onCreate(Bundle saved) {
        super.onCreate(saved);
        web = new WebView(this);
        setContentView(web);
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setAllowFileAccess(true);
        web.getSettings().setAllowFileAccessFromFileURLs(false);
        web.getSettings().setAllowUniversalAccessFromFileURLs(false);
        web.setWebViewClient(new WebViewClient(){
            @Override public boolean shouldOverrideUrlLoading(WebView view, String url){return !url.startsWith("file:///android_asset/");}
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
            @JavascriptInterface public void speakAtRate(String text,double rate){speakText(text,(float)Math.max(.6,Math.min(1.25,rate)));}
            @JavascriptInterface public void exportProgress(String json){runOnUiThread(()->{
                exportData=json;
                Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("application/json").putExtra(Intent.EXTRA_TITLE,"friends-to-amigos-progress.json");
                startActivityForResult(intent,11);
            });}
        },"AndroidSpeech");
        web.loadUrl("file:///android_asset/index.html");
    }
    private void speakText(String text,float rate){runOnUiThread(()->{
        if(speechReady){speech.setSpeechRate(rate);speech.speak(text,TextToSpeech.QUEUE_FLUSH,null,"spanish");}
        else Toast.makeText(MainActivity.this,"Install an offline Spanish (Spain) voice in Android speech settings.",Toast.LENGTH_LONG).show();
    });}
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
    @Override public void onBackPressed(){web.evaluateJavascript("(() => { const button = document.querySelector('[data-action=leave]') || document.querySelector('[data-action=home]'); if (button) button.click(); })()",null);}
    @Override protected void onPause(){if(speech!=null)speech.stop();web.evaluateJavascript("window.dispatchEvent(new Event('fta-pause'))",null);web.onPause();web.pauseTimers();super.onPause();}
    @Override protected void onResume(){super.onResume();if(web!=null){web.onResume();web.resumeTimers();web.evaluateJavascript("window.dispatchEvent(new Event('fta-resume'))",null);}}
    @Override protected void onDestroy(){if(speech!=null){speech.stop();speech.shutdown();}web.destroy();super.onDestroy();}
}
