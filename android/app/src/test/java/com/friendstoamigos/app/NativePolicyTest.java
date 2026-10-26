package com.friendstoamigos.app;
import org.junit.Test;
import static org.junit.Assert.*;
public class NativePolicyTest {
    @Test public void onlyExplicitWebHandlingConsumesBack(){assertTrue(NativePolicy.handled("true"));assertFalse(NativePolicy.handled("false"));assertFalse(NativePolicy.handled(null));assertFalse(NativePolicy.handled("null"));assertFalse(NativePolicy.handled("\"true\""));}
    @Test public void recommendationLinksStayInAnExternalHttpsBrowser(){
        assertTrue(NativePolicy.externalUrl("https://www.rtve.es/play/clan/pocoyo/"));
        assertTrue(NativePolicy.externalUrl("https://store.steampowered.com/app/413150/"));
        for(String url:new String[]{null,"javascript:alert(1)","file:///android_asset/index.html","http://www.rtve.es/","https://www.rtve.es.evil.test/","https://user@www.rtve.es/","https://www.rtve.es:8443/","intent://anything"}) assertFalse(NativePolicy.externalUrl(url));
    }
    @Test public void listeningSpeedsPassThrough(){assertEquals(.75f,NativePolicy.rate(.75),0);assertEquals(1f,NativePolicy.rate(1),0);}
    @Test public void invalidAndExtremeRatesAreSafe(){assertEquals(.75f,NativePolicy.rate(Double.NaN),0);assertEquals(.75f,NativePolicy.rate(Double.POSITIVE_INFINITY),0);assertEquals(.6f,NativePolicy.rate(-1),0);assertEquals(1.25f,NativePolicy.rate(9),0);}
}
