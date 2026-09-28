import React from "react";
import {createRoot} from "react-dom/client";
import {App} from "./app";
import {initDeck} from "./deck/reveal-init";
import "reveal.js/reveal.css";
import "reveal.js/reset.css";
import "./styles/theme.less";
import "./styles/layout.less";
import "./styles/print.less";

const calculatorRoot = document.getElementById("calculator-root");

if (calculatorRoot) {
    createRoot(calculatorRoot).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}

void initDeck();
