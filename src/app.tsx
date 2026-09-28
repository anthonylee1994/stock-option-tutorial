import React from "react";
import Reveal from "reveal.js";
import {OptionCalculator} from "./calculator/option-calculator";
import {BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams} from "react-router";

const FIRST_SLIDE_PATH = "/slide/0";

function slidePath(index: number): string {
    return `/slide/${index}`;
}

function useRevealReady(): boolean {
    const [ready, setReady] = React.useState<boolean>(() => Reveal.isReady());

    React.useEffect(() => {
        const onReady = () => setReady(true);
        Reveal.on("ready", onReady);
        if (Reveal.isReady()) setReady(true);
        return () => {
            Reveal.off("ready", onReady);
        };
    }, []);

    return ready;
}

/**
 * 由 URL（react-router）話事當前播到第幾頁，再同步落 reveal.js；
 * reveal 自己換頁時亦會反過嚟更新 URL。
 */
const DeckRoute = () => {
    const {index} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const ready = useRevealReady();
    const pathnameRef = React.useRef(location.pathname);
    pathnameRef.current = location.pathname;

    const requested = Number(index);
    const valid = Number.isInteger(requested) && requested >= 0;

    React.useEffect(() => {
        if (!ready || !valid) return;
        const slides = Reveal.getSlides();
        if (slides.length === 0) return;
        const target = Math.min(requested, slides.length - 1);
        if (Reveal.getIndices().h !== target) {
            Reveal.slide(target);
        }
    }, [ready, valid, requested]);

    React.useEffect(() => {
        if (!ready) return;
        const onSlideChanged = () => {
            const path = slidePath(Reveal.getIndices().h);
            if (pathnameRef.current !== path) {
                navigate({pathname: path, search: window.location.search});
            }
        };
        Reveal.on("slidechanged", onSlideChanged);
        return () => {
            Reveal.off("slidechanged", onSlideChanged);
        };
    }, [ready, navigate]);

    if (!valid) {
        return <Navigate to={FIRST_SLIDE_PATH} replace />;
    }

    return null;
};

const RedirectToFirstSlide = () => {
    const location = useLocation();
    return <Navigate to={{pathname: FIRST_SLIDE_PATH, search: location.search}} replace />;
};

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RedirectToFirstSlide />} />
                <Route path="/slide/:index" element={<DeckRoute />} />
                <Route path="*" element={<RedirectToFirstSlide />} />
            </Routes>
            <OptionCalculator />
        </BrowserRouter>
    );
};
