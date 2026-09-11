package com.suyash.p2pshare.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

// the one and only thing the server persists: how many rooms have ever had two
// peers in them. no ids, no ips, no timestamps. one integer in a text file.
@Slf4j
@Service
public class ConnectionCounter {
    private final Path file;
    // volatile so /stats can read it without taking the lock that increment() holds
    private volatile long value;

    public ConnectionCounter(@Value("${peersend.stats.file}") String file) {
        this.file = Path.of(file);
    }

    // read only. this never creates or writes anything, so a boot (or a test
    // context) with no file leaves no trace on disk.
    @PostConstruct
    void load() {
        if (!Files.exists(file)) {
            log.info("No stats file at {}, connection count starts at 0", file);
            return;
        }
        try {
            value = Long.parseLong(Files.readString(file).trim());
            log.info("Loaded connection count {} from {}", value, file);
        } catch (IOException | NumberFormatException e) {
            // the file is there but we can't make sense of it. don't let the next
            // increment overwrite it: move it aside so the real number can be
            // recovered by hand, and carry on from 0. a decorative counter must
            // never be the reason signaling stays down.
            quarantine(e);
        }
    }

    private void quarantine(Exception cause) {
        Path aside = file.resolveSibling(file.getFileName() + ".corrupt-" + System.currentTimeMillis());
        try {
            Files.move(file, aside);
            log.error("Stats file {} is unreadable ({}). Moved it to {} and restarting the count at 0",
                    file, cause.getMessage(), aside);
        } catch (IOException moveFailed) {
            log.error("Stats file {} is unreadable ({}) and could not be moved aside ({}). Counting from 0",
                    file, cause.getMessage(), moveFailed.getMessage());
        }
    }

    // bump and write under one lock, so the file always holds exactly the value
    // after the most recent increment. a ~20 byte write per connection is nothing.
    public synchronized long increment() {
        value++;
        long snapshot = value;
        try {
            Files.createDirectories(file.toAbsolutePath().getParent());
            // write to a sibling then rename over the real file, so a crash mid-write
            // can never leave a half-written number behind
            Path tmp = file.resolveSibling(file.getFileName() + ".tmp");
            Files.writeString(tmp, Long.toString(snapshot));
            Files.move(tmp, file, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            // keep counting in memory. the number just stops surviving restarts
            // until whatever is wrong with the disk is fixed.
            log.warn("Could not persist connection count {} to {}: {}", snapshot, file, e.getMessage());
        }
        return snapshot;
    }

    public long get() {
        return value;
    }
}
