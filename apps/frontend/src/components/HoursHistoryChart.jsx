import { useMemo, useRef, useState } from "react";
import styles from "./HoursHistoryChart.module.css";

const WIDTH = 720;
const HEIGHT = 320;
const MARGIN = { top: 20, right: 24, bottom: 36, left: 48 };
const CHART_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const CHART_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;

/**
 * Formatto le date lavorando sulla stringa ISO grezza (senza passare da un
 * oggetto Date), stesso approccio usato in BikeDetailPage per evitare che la
 * conversione UTC/fuso orario sposti il giorno visualizzato.
 */
const formatAxisDate = (isoDate) => {
    const [, month, day] = isoDate.slice(0, 10).split("-");
    return `${day}/${month}`;
};

const formatFullDate = (isoDate) => {
    const [year, month, day] = isoDate.slice(0, 10).split("-");
    return `${day}/${month}/${year}`;
};

/**
 * Arrotondo il massimo dell'asse Y a un numero "leggibile" (1, 2, 5, 10, 20...)
 * cosi le gridline mostrano valori tondi invece del massimo esatto dei dati.
 */
const getNiceMax = (value) => {
    if (value <= 0) return 1;
    const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
    const normalized = value / magnitude;
    let niceNormalized;
    if (normalized <= 1) niceNormalized = 1;
    else if (normalized <= 2) niceNormalized = 2;
    else if (normalized <= 5) niceNormalized = 5;
    else niceNormalized = 10;
    return niceNormalized * magnitude;
};

/**
 * Grafico storico ore cumulate per una moto: riceve punti gia' ordinati per
 * data (con ore cumulate progressive) e disegna una linea con marker,
 * gridline e un tooltip al passaggio del mouse/tocco. Sotto al grafico
 * espongo gli stessi dati in una tabella accessibile.
 */
function HoursHistoryChart({ data }) {
    const svgRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(null);

    const { points, yTicks, minDate, maxDate } = useMemo(() => {
        const timestamps = data.map((d) => new Date(d.date).getTime());
        const minTs = Math.min(...timestamps);
        const maxTs = Math.max(...timestamps);
        const maxValue = Math.max(...data.map((d) => d.cumulativeHours), 0);
        const niceMax = getNiceMax(maxValue);

        const xForTs = (ts) => {
            if (maxTs === minTs) return MARGIN.left + CHART_WIDTH / 2;
            return MARGIN.left + ((ts - minTs) / (maxTs - minTs)) * CHART_WIDTH;
        };
        const yForValue = (value) => MARGIN.top + CHART_HEIGHT - (value / niceMax) * CHART_HEIGHT;

        const pts = data.map((d, index) => ({
            ...d,
            x: xForTs(timestamps[index]),
            y: yForValue(d.cumulativeHours),
            index,
        }));

        const ticks = [0, 0.25, 0.5, 0.75, 1].map((fraction) => ({
            value: Math.round(niceMax * fraction * 10) / 10,
            y: yForValue(niceMax * fraction),
        }));

        return { points: pts, yTicks: ticks, minDate: data[0].date, maxDate: data[data.length - 1].date };
    }, [data]);

    const handlePointerActivity = (event) => {
        if (!svgRef.current || points.length === 0) return;
        const rect = svgRef.current.getBoundingClientRect();
        const relativeX = ((event.clientX - rect.left) / rect.width) * WIDTH;

        let nearest = points[0];
        let nearestDistance = Math.abs(points[0].x - relativeX);
        for (const point of points) {
            const distance = Math.abs(point.x - relativeX);
            if (distance < nearestDistance) {
                nearest = point;
                nearestDistance = distance;
            }
        }
        setActiveIndex(nearest.index);
    };

    const handlePointerLeave = () => setActiveIndex(null);

    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const active = activeIndex != null ? points[activeIndex] : null;

    return (
        <div className={styles.wrapper}>
            <svg
                ref={svgRef}
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                className={styles.chart}
                role="img"
                aria-label="Grafico storico delle ore cumulate"
                onPointerMove={handlePointerActivity}
                onPointerDown={handlePointerActivity}
                onPointerLeave={handlePointerLeave}
            >
                {yTicks.map((tick) => (
                    <g key={tick.value}>
                        <line x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={tick.y} y2={tick.y} className={styles.gridLine} />
                        <text x={MARGIN.left - 10} y={tick.y} className={styles.axisLabel} textAnchor="end" dominantBaseline="middle">
                            {tick.value}
                        </text>
                    </g>
                ))}

                <text x={MARGIN.left} y={HEIGHT - 8} className={styles.axisLabel} textAnchor="start">
                    {formatAxisDate(minDate)}
                </text>
                {maxDate !== minDate && (
                    <text x={WIDTH - MARGIN.right} y={HEIGHT - 8} className={styles.axisLabel} textAnchor="end">
                        {formatAxisDate(maxDate)}
                    </text>
                )}

                {points.length > 1 && <path d={linePath} className={styles.line} fill="none" />}

                {points.map((point) => (
                    <circle key={point.index} cx={point.x} cy={point.y} r={4} className={styles.point} />
                ))}

                {active && (
                    <g>
                        <line x1={active.x} x2={active.x} y1={MARGIN.top} y2={MARGIN.top + CHART_HEIGHT} className={styles.crosshair} />
                        <circle cx={active.x} cy={active.y} r={6} className={styles.activePoint} />
                    </g>
                )}
            </svg>

            {active && (
                <div className={styles.tooltip} style={{ left: `${(active.x / WIDTH) * 100}%`, top: `${(active.y / HEIGHT) * 100}%` }}>
                    <strong>{formatFullDate(active.date)}</strong>
                    <span>{active.cumulativeHours} h totali</span>
                </div>
            )}

            <details className={styles.tableDetails}>
                <summary>Mostra dati in tabella</summary>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th scope="col">Data</th>
                            <th scope="col">Ore cumulate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((d, index) => (
                            <tr key={`${d.date}-${index}`}>
                                <td>{formatFullDate(d.date)}</td>
                                <td>{d.cumulativeHours} h</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </details>
        </div>
    );
}

export default HoursHistoryChart;
