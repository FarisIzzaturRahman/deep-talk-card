import assert from "node:assert/strict";
import test from "node:test";
import { buildShareFilename, wrapTextLines } from "../lib/share-card";

test("wraps text cleanly into balanced lines within the width budget", () => {
    const lines = wrapTextLines(
        "Kapan momen di mana lo merasa berhasil melepaskan hal yang memang bukan rezeki lo?",
        20,
        (line) => line.length,
    );

    assert.ok(lines.length > 1);
    for (const line of lines) {
        assert.ok(line.length <= 20, `line exceeded width: "${line}"`);
    }
    assert.equal(lines.join(" "), "Kapan momen di mana lo merasa berhasil melepaskan hal yang memang bukan rezeki lo?");
});

test("builds safe lowercase PNG filenames for shared cards", () => {
    assert.equal(
        buildShareFilename("deep-talk", "dt-12"),
        "ajakbicara-deep-talk-dt-12.png",
    );
    assert.equal(
        buildShareFilename("ringkasan", "PDKT & Chemistry"),
        "ajakbicara-ringkasan-pdkt-chemistry.png",
    );
});
