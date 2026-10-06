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
}
