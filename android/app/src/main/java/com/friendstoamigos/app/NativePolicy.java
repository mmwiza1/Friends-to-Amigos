package com.friendstoamigos.app;
final class NativePolicy {
    static boolean externalUrl(String value) {
        try {
            java.net.URI uri = new java.net.URI(value);
            if (!"https".equals(uri.getScheme()) || uri.getUserInfo() != null || uri.getPort() != -1) return false;
            return java.util.Arrays.asList("www.rtve.es", "difusion.com", "www.thefablecottage.com",
                "store.steampowered.com", "www.youtube.com", "www.planetadelibros.com",
                "www.planetadelibros.cl", "albalearning.com", "librivox.org").contains(uri.getHost());
        } catch (java.net.URISyntaxException | NullPointerException error) { return false; }
    }
    private NativePolicy(){}
    static boolean handled(String result){return "true".equals(result);}
    static float rate(double value){return (float)(Double.isFinite(value)?Math.max(.6,Math.min(1.25,value)):.75);}
}
