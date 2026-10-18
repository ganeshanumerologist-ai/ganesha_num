// Runtime contrast audit — page ke har visible text node ka
// contrast apne actual background ke against.
//
// Static CSS scan me chhoot jate hain: gradient text, inline styles,
// opacity, aur jo elements inherited colour lete hain. Yahan browser
// me real pixels dekh kar pakda jata hai.
(() => {
  function lum([r, g, b]) {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }
  function ratio(a, b) {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  }
  const parse = (s) => {
    const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(s);
    return m ? { rgb: [+m[1], +m[2], +m[3]], a: m[4] === undefined ? 1 : +m[4] } : null;
  };
  function over(fg, bg, a) {
    return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));
  }

  // ancestor backgrounds (transparent hatate hue)
  function bgOf(el) {
    let acc = null;
    let e = el;
    while (e && e !== document.documentElement.parentNode) {
      const c = parse(getComputedStyle(e).backgroundColor);
      if (c && c.a > 0) {
        acc = acc ? over(acc, c.rgb, c.a) : c.rgb;
        if (c.a >= 0.99) break;
      }
      e = e.parentElement;
    }
    return acc || [255, 255, 255];
  }

  const bad = [];
  const seen = new Set();

  document.querySelectorAll("body *").forEach((el) => {
    // sirf seedha text wale elements
    const own = [...el.childNodes].some(
      (n) => n.nodeType === 3 && n.textContent.trim().length > 2
    );
    if (!own) return;

    const rect = el.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return;
    if (rect.bottom < 0 || rect.top > innerHeight * 4) return;

    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") return;
    if (+cs.opacity < 0.15) return;

    const fgP = parse(cs.color);
    if (!fgP) return;

    const bg = bgOf(el);
    const fg = fgP.a < 1 ? over(fgP.rgb, bg, fgP.a) : fgP.rgb;
    const r = ratio(fg, bg);

    // bada text (>=18.66px bold ya >=24px) 3:1 se chalta hai
    const size = parseFloat(cs.fontSize);
    const bold = +cs.fontWeight >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const need = large ? 3 : 4.5;

    if (r < need) {
      const key = `${cs.color}|${Math.round(r * 10)}|${el.tagName}`;
      if (seen.has(key)) return;
      seen.add(key);
      bad.push({
        text: el.textContent.trim().slice(0, 44),
        tag: el.tagName,
        cls: String(el.className).slice(0, 34),
        color: cs.color,
        size: Math.round(size),
        ratio: +r.toFixed(2),
        need,
        bg: `rgb(${bg.map(Math.round).join(",")})`,
      });
    }
  });

  bad.sort((a, b) => a.ratio - b.ratio);
  return {
    total: bad.length,
    worst: bad.slice(0, 14),
  };
})()