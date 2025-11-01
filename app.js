// Global state
let selectedSymptoms = [];
let selectedDiseases = [];
let currentResults = [];
let activeTab = 'symptoms';

// DOM Elements
const symptomsSearch = document.getElementById('symptomsSearch');
const diseasesSearch = document.getElementById('diseasesSearch');
const symptomsDropdown = document.getElementById('symptomsDropdown');
const diseasesDropdown = document.getElementById('diseasesDropdown');
const selectedSymptomsContainer = document.getElementById('selectedSymptoms');
const selectedDiseasesContainer = document.getElementById('selectedDiseases');
const resultsSection = document.getElementById('resultsSection');
const resultsBody = document.getElementById('resultsBody');
const resultsCount = document.getElementById('resultsCount');
const noResults = document.getElementById('noResults');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeSearch();
    initializeButtons();
});

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    activeTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.getElementById('symptomsTab').classList.toggle('hidden', tabName !== 'symptoms');
    document.getElementById('diseasesTab').classList.toggle('hidden', tabName !== 'diseases');
}

// Search functionality
function initializeSearch() {
    // Symptoms search
    symptomsSearch.addEventListener('input', function() {
        filterDropdown(this.value, SYMPTOMS_LIST, symptomsDropdown, selectedSymptoms);
    });
    
    symptomsSearch.addEventListener('focus', function() {
        filterDropdown(this.value, SYMPTOMS_LIST, symptomsDropdown, selectedSymptoms);
        symptomsDropdown.classList.add('show');
    });
    
    // Diseases search
    diseasesSearch.addEventListener('input', function() {
        filterDropdown(this.value, DISEASES_LIST, diseasesDropdown, selectedDiseases);
    });
    
    diseasesSearch.addEventListener('focus', function() {
        filterDropdown(this.value, DISEASES_LIST, diseasesDropdown, selectedDiseases);
        diseasesDropdown.classList.add('show');
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.multi-select-container')) {
            symptomsDropdown.classList.remove('show');
            diseasesDropdown.classList.remove('show');
        }
    });
}

function filterDropdown(searchTerm, itemsList, dropdownElement, selectedItems) {
    const filtered = itemsList.filter(item => 
        item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    dropdownElement.innerHTML = '';
    
    if (filtered.length === 0) {
        dropdownElement.innerHTML = '<div class="dropdown-item">No matches found</div>';
        dropdownElement.classList.add('show');
        return;
    }
    
    filtered.forEach(item => {
        const div = document.createElement('div');
        div.className = 'dropdown-item';
        if (selectedItems.includes(item)) {
            div.classList.add('selected');
        }
        div.textContent = item;
        div.addEventListener('click', function() {
            toggleSelection(item, selectedItems, dropdownElement);
        });
        dropdownElement.appendChild(div);
    });
    
    dropdownElement.classList.add('show');
}

function toggleSelection(item, selectedArray, dropdownElement) {
    const index = selectedArray.indexOf(item);
    
    if (index > -1) {
        selectedArray.splice(index, 1);
    } else {
        selectedArray.push(item);
    }
    
    updateSelectedItems();
    
    // Update dropdown items
    const dropdownItems = dropdownElement.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(div => {
        if (div.textContent === item) {
            div.classList.toggle('selected');
        }
    });
}

function updateSelectedItems() {
    // Update symptoms
    selectedSymptomsContainer.innerHTML = '';
    selectedSymptoms.forEach(symptom => {
        const tag = createSelectedTag(symptom, selectedSymptoms);
        selectedSymptomsContainer.appendChild(tag);
    });
    
    // Update diseases
    selectedDiseasesContainer.innerHTML = '';
    selectedDiseases.forEach(disease => {
        const tag = createSelectedTag(disease, selectedDiseases);
        selectedDiseasesContainer.appendChild(tag);
    });
}

function createSelectedTag(text, array) {
    const tag = document.createElement('div');
    tag.className = 'selected-item';
    tag.innerHTML = `
        <span>${text}</span>
        <span class="remove-item">×</span>
    `;
    
    tag.querySelector('.remove-item').addEventListener('click', function() {
        const index = array.indexOf(text);
        if (index > -1) {
            array.splice(index, 1);
            updateSelectedItems();
        }
    });
    
    return tag;
}

// Button functionality
function initializeButtons() {
    document.getElementById('searchSymptomsBtn').addEventListener('click', function() {
        searchBySymptoms();
    });
    
    document.getElementById('clearSymptomsBtn').addEventListener('click', function() {
        selectedSymptoms = [];
        symptomsSearch.value = '';
        updateSelectedItems();
        clearResults();
    });
    
    document.getElementById('searchDiseasesBtn').addEventListener('click', function() {
        searchByDiseases();
    });
    
    document.getElementById('clearDiseasesBtn').addEventListener('click', function() {
        selectedDiseases = [];
        diseasesSearch.value = '';
        updateSelectedItems();
        clearResults();
    });
    
    document.getElementById('selectAllBtn').addEventListener('click', selectAllResults);
    document.getElementById('deselectAllBtn').addEventListener('click', deselectAllResults);
    document.getElementById('exportPdfBtn').addEventListener('click', exportToPDF);
}

// Search functions
function searchBySymptoms() {
    if (selectedSymptoms.length === 0) {
        alert('Please select at least one symptom');
        return;
    }
    
    currentResults = ACUPUNCTURE_DATA.filter(point => {
        const pointSymptoms = point.Symptoms.toLowerCase();
        return selectedSymptoms.some(symptom => 
            pointSymptoms.includes(symptom.toLowerCase())
        );
    });
    
    displayResults();
}

function searchByDiseases() {
    if (selectedDiseases.length === 0) {
        alert('Please select at least one disease');
        return;
    }
    
    currentResults = ACUPUNCTURE_DATA.filter(point => {
        const pointDiseases = point.Diseases.toLowerCase();
        return selectedDiseases.some(disease => 
            pointDiseases.includes(disease.toLowerCase())
        );
    });
    
    displayResults();
}

function displayResults() {
    resultsBody.innerHTML = '';
    
    if (currentResults.length === 0) {
        resultsSection.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }
    
    noResults.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    resultsCount.textContent = `${currentResults.length} point${currentResults.length !== 1 ? 's' : ''} found`;
    
    currentResults.forEach((point, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align: center;"><input type="checkbox" class="point-checkbox" data-index="${index}" checked></td>
            <td>${point['Meridian System']}</td>
            <td><strong>${point['Point Code']}</strong></td>
            <td>${point['English Name']}</td>
            <td>${point['Chinese Name']}</td>
            <td>${point['Pinyin']}</td>
            <td>${point['Point Category']}</td>
            <td>${point['Indications']}</td>
            <td>${point['Symptoms']}</td>
            <td>${point['Diseases']}</td>
            <td>${point['Functions']}</td>
            <td>${point['Location (Cun)']}</td>
            <td>${point['Anatomical Location']}</td>
            <td>${point['General Location']}</td>
            <td>${point['Contraindications']}</td>
            <td>${point['Needling Depth']}</td>
            <td>${point['Needling Method']}</td>
            <td>${point['Stimulation Method']}</td>
            <td>${point['Electrical Stimulation']}</td>
        `;
        resultsBody.appendChild(row);
    });
}

function clearResults() {
    currentResults = [];
    resultsSection.classList.add('hidden');
    noResults.classList.add('hidden');
}

function selectAllResults() {
    document.querySelectorAll('.point-checkbox').forEach(checkbox => {
        checkbox.checked = true;
    });
}

function deselectAllResults() {
    document.querySelectorAll('.point-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
}

// PDF Export
function exportToPDF() {
    const patientName = document.getElementById('patientName').value || 'N/A';
    const patientAge = document.getElementById('patientAge').value || 'N/A';
    const patientSex = document.getElementById('patientSex').value || 'N/A';
    
    // Get selected points
    const selectedPoints = [];
    document.querySelectorAll('.point-checkbox').forEach((checkbox, index) => {
        if (checkbox.checked) {
            selectedPoints.push(currentResults[index]);
        }
    });
    
    if (selectedPoints.length === 0) {
        alert('Please select at least one acupuncture point to include in the prescription');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape for better table fit
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80);
    doc.text('SHIZOR - Acupuncture Prescription', 148, 20, { align: 'center' });
    
    // Date
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    doc.setFontSize(10);
    doc.setTextColor(108, 117, 125);
    doc.text(`Date: ${dateStr}`, 148, 27, { align: 'center' });
    
    // Patient Information
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text('Patient Information', 15, 38);
    doc.setFontSize(10);
    doc.setTextColor(73, 80, 87);
    doc.text(`Name: ${patientName}`, 15, 45);
    doc.text(`Age: ${patientAge}`, 70, 45);
    doc.text(`Sex: ${patientSex}`, 100, 45);
    
    // Prepare table data
    const tableData = selectedPoints.map(point => [
        point['Meridian System'],
        point['Point Code'],
        point['English Name'],
        point['Chinese Name'],
        point['Pinyin'],
        point['Point Category'],
        point['Functions'],
        point['Indications'],
        point['Location (Cun)'],
        point['Anatomical Location'],
        point['Needling Depth'],
        point['Needling Method']
    ]);
    
    // Table
    doc.autoTable({
        startY: 52,
        head: [[
            'Meridian',
            'Code',
            'English Name',
            'Chinese',
            'Pinyin',
            'Category',
            'Functions',
            'Indications',
            'Location',
            'Anatomical',
            'Depth',
            'Method'
        ]],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: [44, 62, 80],
            textColor: [255, 255, 255],
            fontSize: 8,
            fontStyle: 'bold'
        },
        bodyStyles: {
            fontSize: 7,
            textColor: [51, 51, 51]
        },
        alternateRowStyles: {
            fillColor: [248, 249, 250]
        },
        margin: { left: 15, right: 15 },
        styles: {
            cellPadding: 2,
            overflow: 'linebreak',
            cellWidth: 'wrap'
        },
        columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 15 },
            2: { cellWidth: 25 },
            3: { cellWidth: 15 },
            4: { cellWidth: 15 },
            5: { cellWidth: 20 },
            6: { cellWidth: 35 },
            7: { cellWidth: 30 },
            8: { cellWidth: 25 },
            9: { cellWidth: 25 },
            10: { cellWidth: 15 },
            11: { cellWidth: 20 }
        }
    });
    
    // Additional details on new pages if needed
    let finalY = doc.lastAutoTable.finalY + 10;
    
    // Add detailed information
    doc.setFontSize(10);
    doc.setTextColor(108, 117, 125);
    
    if (finalY > 180) {
        doc.addPage();
        finalY = 20;
    }
    
    doc.text('Additional Point Details:', 15, finalY);
    finalY += 7;
    
    selectedPoints.forEach((point, index) => {
        if (finalY > 180) {
            doc.addPage();
            finalY = 20;
        }
        
        doc.setFontSize(9);
        doc.setTextColor(44, 62, 80);
        doc.text(`${index + 1}. ${point['Point Code']} - ${point['English Name']}`, 15, finalY);
        finalY += 5;
        
        doc.setFontSize(8);
        doc.setTextColor(73, 80, 87);
        
        const details = [
            `Symptoms: ${point['Symptoms']}`,
            `Diseases: ${point['Diseases']}`,
            `Contraindications: ${point['Contraindications']}`,
            `Stimulation: ${point['Stimulation Method']} | Electrical: ${point['Electrical Stimulation']}`
        ];
        
        details.forEach(detail => {
            if (finalY > 185) {
                doc.addPage();
                finalY = 20;
            }
            const lines = doc.splitTextToSize(detail, 270);
            doc.text(lines, 20, finalY);
            finalY += (lines.length * 4);
        });
        
        finalY += 3;
    });
    
    // Footer on last page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 148, 200, { align: 'center' });
        doc.text('Generated by SHIZOR - Acupuncture Point Prescription System', 148, 205, { align: 'center' });
    }
    
    // Save PDF
    const fileName = `Acupuncture_Prescription_${patientName.replace(/\s+/g, '_')}_${today.getFullYear()}${(today.getMonth()+1).toString().padStart(2,'0')}${today.getDate().toString().padStart(2,'0')}.pdf`;
    doc.save(fileName);
}