package com.friendstoamigos.app;
import org.junit.Test;
import static org.junit.Assert.*;
public class NativePolicyTest {
    @Test public void onlyExplicitWebHandlingConsumesBack(){assertTrue(NativePolicy.handled("true"));assertFalse(NativePolicy.handled("false"));assertFalse(NativePolicy.handled(null));assertFalse(NativePolicy.handled("null"));assertFalse(NativePolicy.handled("\"true\""));}
    @Test public void listeningSpeedsPassThrough(){assertEquals(.75f,NativePolicy.rate(.75),0);assertEquals(1f,NativePolicy.rate(1),0);}
    @Test public void invalidAndExtremeRatesAreSafe(){assertEquals(.75f,NativePolicy.rate(Double.NaN),0);assertEquals(.75f,NativePolicy.rate(Double.POSITIVE_INFINITY),0);assertEquals(.6f,NativePolicy.rate(-1),0);assertEquals(1.25f,NativePolicy.rate(9),0);}
}
