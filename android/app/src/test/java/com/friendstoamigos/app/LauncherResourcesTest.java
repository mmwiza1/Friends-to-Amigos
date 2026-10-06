package com.friendstoamigos.app;

import org.junit.Test;
import java.nio.file.Files;
import java.nio.file.Path;
import static org.junit.Assert.*;

/** Checks packaging inputs on the JVM; actual launcher rendering needs a device. */
public class LauncherResourcesTest {
    private Path resource(String relative) { return Path.of("src/main/res", relative); }

    @Test public void adaptiveIconsUseMascotAndThemedLayer() throws Exception {
        for (String name : new String[]{"ic_launcher", "ic_launcher_round"}) {
            for (int api : new int[]{26, 33}) {
                String xml = Files.readString(resource("mipmap-anydpi-v" + api + "/" + name + ".xml"));
                assertTrue(xml.contains("@drawable/ic_launcher_foreground"));
                assertTrue(xml.contains("@drawable/ic_launcher_background"));
                if (api == 33) assertTrue(xml.contains("@drawable/ic_launcher_monochrome"));
            }
        }
        assertTrue(Files.size(resource("drawable-nodpi/launcher_bull.png")) > 10000);
        assertTrue(Files.size(resource("drawable-nodpi/launcher_bull_monochrome.png")) > 1000);
    }

    @Test public void densityFallbacksIncludeNormalAndRoundIcons() throws Exception {
        String[] densities = {"mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"};
        int[] sizes = {48, 72, 96, 144, 192};
        for (int i = 0; i < densities.length; i++) {
            for (String name : new String[]{"ic_launcher", "ic_launcher_round"}) {
                byte[] png = Files.readAllBytes(resource("mipmap-" + densities[i] + "/" + name + ".png"));
                assertEquals(0x89, png[0] & 0xff);
                int width = java.nio.ByteBuffer.wrap(png, 16, 4).getInt();
                int height = java.nio.ByteBuffer.wrap(png, 20, 4).getInt();
                assertEquals(sizes[i], width);
                assertEquals(sizes[i], height);
            }
        }
    }
}
