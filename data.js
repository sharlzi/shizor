// Additional data file for quick reference
// This file provides summary information about the acupuncture dataset

const DATA_SUMMARY = {
    totalPoints: 500,
    totalSymptoms: 293,
    totalDiseases: 271,
    meridianSystems: [
        "Lung (LU)",
        "Large Intestine (LI)",
        "Stomach (ST)",
        "Spleen (SP)",
        "Heart (HT)",
        "Small Intestine (SI)",
        "Bladder (BL)",
        "Kidney (KI)",
        "Pericardium (PC)",
        "Triple Energizer (TE)",
        "Gall Bladder (GB)",
        "Liver (LR)",
        "Governing Vessel (GV)",
        "Conception Vessel (CV)"
    ],
    categories: [
        "Yuan-Source",
        "Luo-Connecting",
        "He-Sea",
        "Shu-Stream",
        "Jing-River",
        "Jing-Well",
        "Ying-Spring",
        "Front-Mu",
        "Back-Shu",
        "Xi-Cleft",
        "Command Point",
        "Hui-Meeting",
        "Window of Heaven",
        "Confluent Point"
    ]
};

if (typeof window !== 'undefined') {
    window.DATA_SUMMARY = DATA_SUMMARY;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DATA_SUMMARY };
}