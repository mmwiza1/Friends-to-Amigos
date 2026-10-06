package com.friendstoamigos.app;
final class NativePolicy {
    private NativePolicy(){}
    static boolean handled(String result){return "true".equals(result);}
    static float rate(double value){return (float)(Double.isFinite(value)?Math.max(.6,Math.min(1.25,value)):.75);}
}
