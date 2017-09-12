import extend from './extend';

const color = "#eee";
const legendColor = "#eee";
const bgColor = "transparent"; //rgba(0,0,0,.1)";
const titleColor = "#4a667a";
const subTitleColor = "#526e82";
const axisLabelColor = subTitleColor;
const axisLineColor = subTitleColor;
const chartColors = ['#944BE8', '#02D4BF', '#38b4ee', '#303f9f'];

export function getTitle(title, subTitle) {
    return {
        //top:5,
        left: "center",
        text: title,
        textStyle: {
            color: titleColor
        },
        subtext: subTitle,
        subtextStyle: {
            color: subTitleColor,
        }
    }
}
export function getLegend(legend) {
    return extend(true, {}, {
        top: 0,
        textStyle: {
            color: legendColor
        }
    }, legend);
}
export function getToolbox() {
    return {
        show: false
    }
}
export function getX(x) {
    return extend(true, {}, {
        splitLine: { //网格线
            show: false
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: axisLabelColor,
                opacity: 0.4
            }
        },
        axisTick: {
            alignWithLabel: true
        },
        axisLabel: {
            interval: 0,
            rotate: 45,
            show: true,
            splitNumber: 5,
            textStyle: {
                color: axisLineColor,
                fontFamily: "Lato"
            }
        },
    }, x);
}
export function getY(y) {
    return extend(true, {}, {
        scale: true,
        axisTick: { show: false },
        axisLabel: {
            textStyle: {
                color: axisLabelColor,
                fontFamily: "Lato"
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: axisLineColor,
                opacity: 0.4
            }
        },
        splitLine: { //网格线
            show: false
        }
    }, y);
}
export function getLineSeries(s, order = 0) {
    let markPointData = [];
    s.data.forEach((d, idx) => {
        if (idx > 0) {
            let value = d - s.data[idx - 1];
            markPointData.push({
                value: d - s.data[idx - 1],
                coord: [idx, d],

                itemStyle: {
                    normal: {
                        color: value > 0 ? "green" : "red"
                    }
                }
            });
        }
    });
    return extend(true, {}, {
        type: 'line',
        smooth: true,
        symbolSize: 12,
        label: {
            normal: {
                show: true,
                position: 'top',
                fontFamily: "Lato"
            }
        },
        lineStyle: {
            normal: {
                width: 3,
                shadowColor: 'rgba(0,0,0,.6)',
                shadowBlur: 8,
                shadowOffsetY: 5
            }
        },
        animationDelay: function(idx) {
            return idx * 10 + (order * 100);
        }
    }, s);
}
export function getBarSeries(s, order = 0) {
    return extend(true, {}, {
        type: 'bar',
        barWidth: 10,
        barGap: 0, //柱间距离
        label: {
            normal: {
                show: true,
                position: 'top',
                fontFamily: "Lato"
            }
        },
        itemStyle: {
            normal: {
                barBorderRadius: [2, 2, 0, 0],
                opacity: 1
            }
        },
        animationDelay: function(idx) {
            return idx * 10 + (order * 100);
        }
    }, s);
}
export function getOptions(opts) {
    return extend(true, {}, {
        backgroundColor: bgColor,
        color: chartColors,
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: 80,
            right: 20,
            top: 40,
            bottom: 60
        },
        animationEasing: 'elasticOut',
        animationDelayUpdate: function(idx) {
            return idx * 5;
        },
        textStyle: {
            fontSize: 14
        }

    }, opts);
}