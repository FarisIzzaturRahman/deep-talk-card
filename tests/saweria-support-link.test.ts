import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SaweriaSupportLink } from "../components/SaweriaSupportLink";

test("opens the official ajakBicara Saweria page safely in a new tab", () => {
    const markup = renderToStaticMarkup(createElement(SaweriaSupportLink));

    assert.match(markup, /href="https:\/\/saweria\.co\/ajakbicara"/);
    assert.match(markup, /target="_blank"/);
    assert.match(markup, /rel="noopener noreferrer"/);
    assert.match(markup, /Dukung lewat Saweria/);
});
