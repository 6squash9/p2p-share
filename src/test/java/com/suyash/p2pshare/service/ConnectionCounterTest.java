package com.suyash.p2pshare.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

class ConnectionCounterTest {

    private static ConnectionCounter counterAt(Path file) {
        ConnectionCounter c = new ConnectionCounter(file.toString());
        c.load();
        return c;
    }

    @Test
    void missingFileStartsAtZeroAndTouchesNothing(@TempDir Path dir) {
        Path file = dir.resolve("sub").resolve("connections.txt");
        ConnectionCounter c = counterAt(file);

        assertEquals(0, c.get());
        assertFalse(Files.exists(dir.resolve("sub")), "load() must not create directories");
    }

    @Test
    void incrementPersistsAndSurvivesRestart(@TempDir Path dir) throws IOException {
        Path file = dir.resolve("connections.txt");
        ConnectionCounter first = counterAt(file);

        assertEquals(1, first.increment());
        assertEquals(2, first.increment());
        assertEquals("2", Files.readString(file));
        assertFalse(Files.exists(dir.resolve("connections.txt.tmp")), "tmp file must be renamed away");

        // a "restart": a brand new instance on the same path
        ConnectionCounter second = counterAt(file);
        assertEquals(2, second.get());
        assertEquals(3, second.increment());
    }

    @Test
    void garbageFileIsMovedAsideNotOverwritten(@TempDir Path dir) throws IOException {
        Path file = dir.resolve("connections.txt");
        Files.writeString(file, "definitely not a number");

        ConnectionCounter c = counterAt(file);

        assertEquals(0, c.get());
        assertFalse(Files.exists(file), "the corrupt file must be moved out of the way");
        try (Stream<Path> siblings = Files.list(dir)) {
            Path aside = siblings
                    .filter(p -> p.getFileName().toString().startsWith("connections.txt.corrupt-"))
                    .findFirst()
                    .orElseThrow(() -> new AssertionError("corrupt file was not quarantined"));
            assertEquals("definitely not a number", Files.readString(aside), "evidence must be preserved verbatim");
        }
        // and counting carries on from 0, into a fresh file
        assertEquals(1, c.increment());
        assertEquals("1", Files.readString(file));
    }

    @Test
    void unwritablePathStillCountsInMemory(@TempDir Path dir) throws IOException {
        // a regular file where the parent directory should be, so createDirectories fails
        Path blocker = dir.resolve("blocker");
        Files.writeString(blocker, "i am a file, not a directory");
        ConnectionCounter c = counterAt(blocker.resolve("connections.txt"));

        assertEquals(1, c.increment());
        assertEquals(2, c.increment());
        assertEquals(2, c.get());
    }
}
