package com.friendstoamigos.app;

/** Pure layout arithmetic, shared by inset callbacks and JVM regression tests. */
final class NativeInsets {
    private NativeInsets(){}
    static float validScale(float scale,float density){return Float.isFinite(scale)&&scale>0?scale:Float.isFinite(density)&&density>0?density:1f;}
    static float cssPixels(int physicalPixels,float scale){return Math.max(0,physicalPixels)/validScale(scale,1f);}
    static boolean isKeyboard(int bottom,int navigationBottom,float density){return bottom-Math.max(0,navigationBottom)>100*validScale(density,1f);}
    static int keyboardOverlap(int imeBottom,int windowHeight,int viewBottom){
        // adjustResize may have already removed all or part of the IME area.
        // Only the remaining overlap belongs in CSS, avoiding double padding.
        int removed=Math.max(0,Math.max(0,windowHeight)-Math.max(0,viewBottom));
        return Math.max(0,Math.max(0,imeBottom)-removed);
    }
}
