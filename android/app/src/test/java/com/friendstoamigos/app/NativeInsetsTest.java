package com.friendstoamigos.app;

import org.junit.Test;
import static org.junit.Assert.*;

public class NativeInsetsTest {
    @Test public void physicalInsetsBecomeCssPixelsAtDeviceScale(){assertEquals(24f,NativeInsets.cssPixels(72,3f),0);assertEquals(16f,NativeInsets.cssPixels(72,4.5f),0);assertEquals(0f,NativeInsets.cssPixels(-4,3f),0);}
    @Test public void invalidScaleNeverProducesInvalidCss(){assertEquals(3f,NativeInsets.validScale(Float.NaN,3f),0);assertEquals(1f,NativeInsets.validScale(0,Float.POSITIVE_INFINITY),0);assertEquals(20f,NativeInsets.cssPixels(20,0),0);}
    @Test public void unresizedWebViewReceivesKeyboardOverlap(){assertEquals(300,NativeInsets.keyboardOverlap(300,1000,1000));}
    @Test public void resizedWebViewDoesNotDoubleApplyKeyboard(){assertEquals(0,NativeInsets.keyboardOverlap(300,1000,700));assertEquals(0,NativeInsets.keyboardOverlap(300,1000,600));}
    @Test public void partiallyResizedWindowOnlyReceivesRemainingOverlap(){assertEquals(150,NativeInsets.keyboardOverlap(300,1000,850));assertEquals(0,NativeInsets.keyboardOverlap(0,1000,1000));}
    @Test public void navigationBarsAreNotMistakenForKeyboard(){assertFalse(NativeInsets.isKeyboard(72,72,3));assertFalse(NativeInsets.isKeyboard(72,0,3));assertTrue(NativeInsets.isKeyboard(900,72,3));assertFalse(NativeInsets.isKeyboard(0,72,3));}
    @Test public void portraitGestureAndThreeButtonInsetsHaveOneCssSourceAtDifferentDensities(){
        // Representative Samsung-class geometry, not model-specific handling.
        for(float density:new float[]{2.75f,3f,3.5f}){
            assertEquals(24f,NativeInsets.cssPixels(Math.round(24*density),density),.2f);
            assertEquals(48f,NativeInsets.cssPixels(Math.round(48*density),density),.2f);
            assertEquals(34f,NativeInsets.cssPixels(Math.round(34*density),density),.2f);
            assertFalse(NativeInsets.isKeyboard(Math.round(48*density),Math.round(48*density),density));
            assertTrue(NativeInsets.isKeyboard(Math.round(340*density),Math.round(24*density),density));
        }
    }
    @Test public void landscapeCutoutAndOverlayImeDoNotDependOnDeviceResolution(){
        assertEquals(34f,NativeInsets.cssPixels(102,3f),0);
        assertEquals(16f,NativeInsets.cssPixels(48,3f),0);
        assertEquals(0,NativeInsets.keyboardOverlap(930,2400,1470));
        assertEquals(930,NativeInsets.keyboardOverlap(930,2400,2400));
        assertEquals(465,NativeInsets.keyboardOverlap(930,2400,1935));
    }

}
