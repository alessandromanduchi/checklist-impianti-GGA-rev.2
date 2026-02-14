// State
let checklistData = [];
let malfunctions = [];
let verificationDirection = null;
let displayedNichesCount = 0;
const NICHES_PER_PAGE = 10;
let sortedNiches = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    registerServiceWorker();
    loadVerificationDirection();
    populateAllNichesSelect();
    
    if (verificationDirection) {
        showMainScreen();
    }
});

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/checklist-impianti-GGA-rev.2/service-worker.js', {
            scope: '/checklist-impianti-GGA-rev.2/'
        })
            .then(registration => console.log('Service Worker registered:', registration))
            .catch(error => console.log('Service Worker registration failed:', error));
    }
}

function loadVerificationDirection() {
    const saved = localStorage.getItem('verificationDirection');
    if (saved) {
        verificationDirection = saved;
    }
}

function saveVerificationDirection() {
    if (verificationDirection) {
        localStorage.setItem('verificationDirection', verificationDirection);
    }
}

function startVerification(direction) {
    verificationDirection = direction;
    saveVerificationDirection();
    showMainScreen();
}

function showMainScreen() {
    document.getElementById('direction-screen').style.display = 'none';
    document.getElementById('main-screen').style.display = 'block';
    document.getElementById('pdf-fab').style.display = 'flex';
    document.getElementById('fab-container').style.display = 'flex';
    
    const directionInfo = document.getElementById('direction-info');
    if (verificationDirection === 'vernio') {
        directionInfo.innerHTML = '🔽 Direzione: Vernio (37+259) → San Benedetto (55+742)';
    } else {
        directionInfo.innerHTML = '🔼 Direzione: San Benedetto (55+742) → Vernio (37+259)';
    }
    
    initializeChecklist();
    loadFromLocalStorage();
    updateProgress();
}

function changeDirection() {
    if (confirm('Vuoi cambiare direzione di verifica? I dati attuali NON verranno cancellati.')) {
        verificationDirection = null;
        localStorage.removeItem('verificationDirection');
        document.getElementById('direction-screen').style.display = 'block';
        document.getElementById('main-screen').style.display = 'none';
        document.getElementById('pdf-fab').style.display = 'none';
        document.getElementById('fab-container').style.display = 'none';
        document.getElementById('checklist').innerHTML = '';
        displayedNichesCount = 0;
    }
}

function initializeChecklist() {
    sortedNiches = [...TECH_NICHES_DATA];
    
    if (verificationDirection === 'vernio') {
        sortedNiches.sort((a, b) => {
            const [kmA, mA] = a.km.split('+').map(Number);
            const [kmB, mB] = b.km.split('+').map(Number);
            if (kmA !== kmB) return kmA - kmB;
            if (mA !== mB) return mA - mB;
            return a.binario.localeCompare(b.binario);
        });
    } else {
        sortedNiches.sort((a, b) => {
            const [kmA, mA] = a.km.split('+').map(Number);
            const [kmB, mB] = b.km.split('+').map(Number);
            if (kmA !== kmB) return kmB - kmA;
            if (mA !== mB) return mB - mA;
            return b.binario.localeCompare(a.binario);
        });
    }
    
    checklistData = [];
    sortedNiches.forEach((niche) => {
        const item = {
            id: `${niche.km}-${niche.binario}`,
            km: niche.km,
            binario: niche.binario,
            types: niche.types,
            completed: false,
            checks: {},
            photosByType: {},
            needsPhoto: {},
            timestamp: null
        };
        
        niche.types.forEach(type => {
            const prefix = type === 'idrante' ? 'idrante' : (type === 'tem' ? 'tem' : 'quadro');
            item.checks[`${prefix}_stato`] = null;
            item.checks[`${prefix}_sigillo`] = null;
            item.checks[`${prefix}_segnaletica`] = null;
            item.photosByType[`${prefix}_stato`] = [];
            item.photosByType[`${prefix}_sigillo`] = [];
            item.photosByType[`${prefix}_segnaletica`] = [];
            item.needsPhoto[`${prefix}_stato`] = false;
            item.needsPhoto[`${prefix}_sigillo`] = false;
            item.needsPhoto[`${prefix}_segnaletica`] = false;
        });
        
        checklistData.push(item);
    });
    
    document.getElementById('niche-count').textContent = `${sortedNiches.length} Nicchie`;
    displayedNichesCount = 0;
    document.getElementById('checklist').innerHTML = '';
    loadMoreNiches();
}

function loadMoreNiches() {
    const checklist = document.getElementById('checklist');
    const startIndex = displayedNichesCount;
    const endIndex = Math.min(startIndex + NICHES_PER_PAGE, checklistData.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const item = checklistData[i];
        const itemEl = createChecklistItem(item, i);
        checklist.appendChild(itemEl);
    }
    
    displayedNichesCount = endIndex;
    
    const loadMoreContainer = document.getElementById('load-more-container');
    if (displayedNichesCount < checklistData.length) {
        loadMoreContainer.style.display = 'block';
        const remaining = checklistData.length - displayedNichesCount;
        document.getElementById('load-more-btn').textContent = 
            `📋 Mostra altre ${Math.min(10, remaining)} nicchie (${remaining} rimanenti)`;
    } else {
        loadMoreContainer.style.display = 'none';
    }
}
                item.needsPhoto.idrante_segnaletica = false;
            }
            if (type === 'tem') {
                item.checks.tem_stato = null;
                item.checks.tem_sigillo = null;
                item.checks.tem_segnaletica = null;
                item.photosByType.tem_stato = [];
                item.photosByType.tem_sigillo = [];
                item.photosByType.tem_segnaletica = [];
                item.needsPhoto.tem_stato = false;
                item.needsPhoto.tem_sigillo = false;
                item.needsPhoto.tem_segnaletica = false;
            }
            if (type === 'quadro_vvf') {
                item.checks.quadro_stato = null;
                item.checks.quadro_sigillo = null;
                item.checks.quadro_segnaletica = null;
                item.photosByType.quadro_stato = [];
                item.photosByType.quadro_sigillo = [];
                item.photosByType.quadro_segnaletica = [];
                item.needsPhoto.quadro_stato = false;
                item.needsPhoto.quadro_sigillo = false;
                item.needsPhoto.quadro_segnaletica = false;
            }
        });
        
        checklistData.push(item);
    });
    
    document.getElementById('niche-count').textContent = `${checklistData.length} Nicchie`;
    
    // Display first 10 niches
    displayNiches(0, NICHES_PER_PAGE);
    updateLoadMoreButton();
    updateProgress();
    populateAllNichesSelect();
}

function displayNiches(start, count) {
    const checklist = document.getElementById('checklist');
    const end = Math.min(start + count, checklistData.length);
    
    for (let i = start; i < end; i++) {
        const item = checklistData[i];
        const itemEl = createChecklistItem(item, i);
        checklist.appendChild(itemEl);
    }
    
    displayedNichesCount = end;
}

function loadMoreNiches() {
    displayNiches(displayedNichesCount, NICHES_PER_PAGE);
    updateLoadMoreButton();
    
    // Scroll to the first newly added niche
    const newNiche = document.getElementById(`item-${checklistData[displayedNichesCount - NICHES_PER_PAGE].id}`);
    if (newNiche) {
        newNiche.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function updateLoadMoreButton() {
    const container = document.getElementById('load-more-container');
    const btn = document.getElementById('load-more-btn');
    const remainingCount = document.getElementById('remaining-count');
    
    const remaining = checklistData.length - displayedNichesCount;
    
    if (remaining > 0) {
        container.style.display = 'block';
        const toShow = Math.min(remaining, NICHES_PER_PAGE);
        btn.textContent = `📋 Mostra altre ${toShow} nicchie`;
        remainingCount.textContent = `Rimanenti: ${remaining} di ${checklistData.length}`;
    } else {
        container.style.display = 'none';
    }
}

// Register Service Worker for PWA
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/checklist-impianti-GGA-rev.2/service-worker.js', {
            scope: '/checklist-impianti-GGA-rev.2/'
        })
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
}

function createChecklistItem(item, index) {
    const div = document.createElement('div');
    div.className = 'check-item';
    div.id = `item-${item.id}`;
    
    let techBadgesHTML = '';
    item.types.forEach(type => {
        if (type === 'idrante') {
            techBadgesHTML += '<span class="tech-badge idrante">🔥 Idrante VVF</span>';
        }
        if (type === 'tem') {
            techBadgesHTML += '<span class="tech-badge tem">📞 TEM</span>';
        }
        if (type === 'quadro_vvf') {
            techBadgesHTML += '<span class="tech-badge quadro">⚡ Quadro VVF</span>';
        }
    });
    
    let checksHTML = '';
    
    // Create checks for each tech type
    item.types.forEach(type => {
        const typeLabel = type === 'idrante' ? 'Idrante VVF' : (type === 'tem' ? 'Colonnina TEM' : 'Quadro VVF');
        const typePrefix = type === 'idrante' ? 'idrante' : (type === 'tem' ? 'tem' : 'quadro');
        
        checksHTML += `
            <div class="check-section">
                <h4 style="color: var(--text-primary); margin-bottom: 1rem; font-weight: 600;">${typeLabel}</h4>
                
                <div class="check-label">Stato dell'apprestamento</div>
                <div class="radio-group">
                    <label class="radio-label">
                        <input type="radio" name="${typePrefix}_stato-${item.id}" value="funzionante" 
                            onchange="handleCheck('${item.id}', '${typePrefix}_stato', 'funzionante')">
                        <span>✓ Funzionante</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="${typePrefix}_stato-${item.id}" value="non_funzionante" 
                            onchange="handleCheck('${item.id}', '${typePrefix}_stato', 'non_funzionante')">
                        <span>✗ Non Funzionante</span>
                    </label>
                </div>
                <div class="photo-btn" id="photo-btn-${typePrefix}-stato-${item.id}">
                    <input type="file" accept="image/*" capture="environment" multiple 
                        onchange="handlePhotos(event, '${item.id}', '${typePrefix}_stato')" 
                        style="display: none;" id="photo-input-${typePrefix}-stato-${item.id}">
                    <label for="photo-input-${typePrefix}-stato-${item.id}" style="cursor: pointer; display: block;">
                        📸 Allega Foto (obbligatoria)
                    </label>
                </div>
                <div id="photos-${typePrefix}-stato-${item.id}" class="photo-preview"></div>
                
                <div class="check-label" style="margin-top: 1rem;">Verifica manomissione sigillo</div>
                <div class="radio-group">
                    <label class="radio-label">
                        <input type="radio" name="${typePrefix}_sigillo-${item.id}" value="integro" 
                            onchange="handleCheck('${item.id}', '${typePrefix}_sigillo', 'integro')">
                        <span>✓ Integro</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="${typePrefix}_sigillo-${item.id}" value="manomesso" 
                            onchange="handleCheck('${item.id}', '${typePrefix}_sigillo', 'manomesso')">
                        <span>✗ Manomesso</span>
                    </label>
                </div>
                <div class="photo-btn" id="photo-btn-${typePrefix}-sigillo-${item.id}">
                    <input type="file" accept="image/*" capture="environment" multiple 
                        onchange="handlePhotos(event, '${item.id}', '${typePrefix}_sigillo')" 
                        style="display: none;" id="photo-input-${typePrefix}-sigillo-${item.id}">
                    <label for="photo-input-${typePrefix}-sigillo-${item.id}" style="cursor: pointer; display: block;">
                        📸 Allega Foto (obbligatoria)
                    </label>
                </div>
                <div id="photos-${typePrefix}-sigillo-${item.id}" class="photo-preview"></div>
                
                <div class="check-label" style="margin-top: 1rem;">Presenza segnaletica di riferimento</div>
                <div class="radio-group">
                    <label class="radio-label">
                        <input type="radio" name="${typePrefix}_segnaletica-${item.id}" value="presente" 
                            onchange="handleCheck('${item.id}', '${typePrefix}_segnaletica', 'presente')">
                        <span>✓ Presente</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="${typePrefix}_segnaletica-${item.id}" value="assente" 
                            onchange="handleCheck('${item.id}', '${typePrefix}_segnaletica', 'assente')">
                        <span>✗ Assente</span>
                    </label>
                </div>
                <div class="photo-btn" id="photo-btn-${typePrefix}-segnaletica-${item.id}">
                    <input type="file" accept="image/*" capture="environment" multiple 
                        onchange="handlePhotos(event, '${item.id}', '${typePrefix}_segnaletica')" 
                        style="display: none;" id="photo-input-${typePrefix}-segnaletica-${item.id}">
                    <label for="photo-input-${typePrefix}-segnaletica-${item.id}" style="cursor: pointer; display: block;">
                        📸 Allega Foto (obbligatoria)
                    </label>
                </div>
                <div id="photos-${typePrefix}-segnaletica-${item.id}" class="photo-preview"></div>
            </div>
        `;
    });
    
    div.innerHTML = `
        <div class="item-header">
            <div>
                <div class="item-title">
                    <span>📍 Km ${item.km} - Binario ${item.binario}</span>
                </div>
                <div class="tech-badges">
                    ${techBadgesHTML}
                </div>
            </div>
        </div>
        <div class="item-meta" id="meta-${item.id}">
            <span>⏳ Non verificata</span>
        </div>
        ${checksHTML}
    `;
    
    return div;
}

function handleCheck(itemId, checkType, value) {
    const item = checklistData.find(i => i.id === itemId);
    if (!item) return;
    
    item.checks[checkType] = value;
    
    // Determine if photo is needed (for negative responses)
    const needsPhoto = value === 'non_funzionante' || value === 'manomesso' || value === 'assente';
    item.needsPhoto[checkType] = needsPhoto;
    
    // Show/hide photo button
    const photoBtn = document.getElementById(`photo-btn-${checkType}-${itemId}`);
    if (photoBtn) {
        photoBtn.style.display = needsPhoto ? 'block' : 'none';
    }
    
    // Update radio label styling
    const radios = document.querySelectorAll(`input[name="${checkType}-${itemId}"]`);
    radios.forEach(radio => {
        const label = radio.closest('.radio-label');
        if (radio.checked) {
            label.style.borderColor = 'var(--primary)';
            if (value === 'funzionante' || value === 'integro' || value === 'presente') {
                label.classList.add('success');
                label.classList.remove('warning');
            } else {
                label.classList.add('warning');
                label.classList.remove('success');
            }
        } else {
            label.style.borderColor = 'var(--border)';
            label.classList.remove('success', 'warning');
        }
    });
    
    updateItemCompletion(itemId);
    saveToLocalStorage();
}

function handlePhotos(event, itemId, checkType) {
    const item = checklistData.find(i => i.id === itemId);
    if (!item) return;
    
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (!item.photosByType[checkType]) {
                item.photosByType[checkType] = [];
            }
            item.photosByType[checkType].push(e.target.result);
            displayPhotos(itemId, checkType);
            updateItemCompletion(itemId);
            saveToLocalStorage();
        };
        reader.readAsDataURL(file);
    });
}

function displayPhotos(itemId, checkType) {
    const item = checklistData.find(i => i.id === itemId);
    if (!item) return;
    
    const container = document.getElementById(`photos-${checkType}-${itemId}`);
    if (!container) return;
    
    const photos = item.photosByType[checkType] || [];
    container.innerHTML = '';
    
    photos.forEach((photo, index) => {
        const div = document.createElement('div');
        div.className = 'photo-item';
        div.innerHTML = `
            <img src="${photo}" alt="Foto ${index + 1}">
            <button class="photo-remove" onclick="removePhoto('${itemId}', '${checkType}', ${index})">×</button>
        `;
        container.appendChild(div);
    });
}

function removePhoto(itemId, checkType, photoIndex) {
    const item = checklistData.find(i => i.id === itemId);
    if (!item) return;
    
    item.photosByType[checkType].splice(photoIndex, 1);
    displayPhotos(itemId, checkType);
    updateItemCompletion(itemId);
    saveToLocalStorage();
}

function updateItemCompletion(itemId) {
    const item = checklistData.find(i => i.id === itemId);
    if (!item) return;
    
    let allChecked = true;
    let allPhotosProvided = true;
    
    // Check all required checks
    for (const type of item.types) {
        const prefix = type === 'idrante' ? 'idrante' : (type === 'tem' ? 'tem' : 'quadro');
        
        if (!item.checks[`${prefix}_stato`] || 
            !item.checks[`${prefix}_sigillo`] || 
            !item.checks[`${prefix}_segnaletica`]) {
            allChecked = false;
            break;
        }
        
        // Check if photos are required and provided
        if (item.needsPhoto[`${prefix}_stato`] && (!item.photosByType[`${prefix}_stato`] || item.photosByType[`${prefix}_stato`].length === 0)) {
            allPhotosProvided = false;
        }
        if (item.needsPhoto[`${prefix}_sigillo`] && (!item.photosByType[`${prefix}_sigillo`] || item.photosByType[`${prefix}_sigillo`].length === 0)) {
            allPhotosProvided = false;
        }
        if (item.needsPhoto[`${prefix}_segnaletica`] && (!item.photosByType[`${prefix}_segnaletica`] || item.photosByType[`${prefix}_segnaletica`].length === 0)) {
            allPhotosProvided = false;
        }
    }
    
    item.completed = allChecked && allPhotosProvided;
    
    if (item.completed) {
        item.timestamp = new Date().toISOString();
    }
    
    updateMeta(itemId);
    updateProgress();
    
    const itemEl = document.getElementById(`item-${itemId}`);
    if (item.completed) {
        itemEl.classList.add('completed');
    } else {
        itemEl.classList.remove('completed');
    }
}

function updateMeta(itemId) {
    const item = checklistData.find(i => i.id === itemId);
    if (!item) return;
    
    const metaEl = document.getElementById(`meta-${itemId}`);
    if (!metaEl) return;
    
    if (item.completed) {
        const date = new Date(item.timestamp);
        metaEl.innerHTML = `
            <span style="color: var(--accent)">✓ Verificata</span>
            <span>${date.toLocaleString('it-IT')}</span>
        `;
    } else {
        metaEl.innerHTML = '<span>⏳ Non verificata</span>';
    }
}

function updateProgress() {
    const completed = checklistData.filter(i => i.completed).length;
    const total = checklistData.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    document.getElementById('progress-fill').style.width = percentage + '%';
    document.getElementById('progress-text').textContent = `${completed} / ${total} nicchie verificate`;
}

// Malfunction modal functions
function openMalfunctionModal() {
    document.getElementById('malfunction-modal').classList.add('show');
}

function closeMalfunctionModal() {
    document.getElementById('malfunction-modal').classList.remove('show');
    document.getElementById('malfunction-form').reset();
    updateMalfunctionForm();
}

function updateMalfunctionForm() {
    const type = document.getElementById('malfunction-type').value;
    const illuminazioneDetail = document.getElementById('illuminazione-detail');
    const corpiCountGroup = document.getElementById('corpi-count-group');
    
    if (type === 'illuminazione') {
        illuminazioneDetail.style.display = 'block';
    } else {
        illuminazioneDetail.style.display = 'none';
        corpiCountGroup.style.display = 'none';
    }
}

document.getElementById('illuminazione-fault-type')?.addEventListener('change', function() {
    const faultType = this.value;
    const corpiCountGroup = document.getElementById('corpi-count-group');
    
    if (faultType === 'corpi_illuminanti') {
        corpiCountGroup.style.display = 'block';
    } else {
        corpiCountGroup.style.display = 'none';
    }
});

function populateAllNichesSelect() {
    const select = document.getElementById('malfunction-km');
    select.innerHTML = '<option value="">Seleziona nicchia...</option>';
    
    ALL_NICHES_DATA.forEach(niche => {
        const option = document.createElement('option');
        option.value = `${niche.km}-${niche.binario}`;
        option.textContent = `${niche.km} - Binario ${niche.binario}`;
        select.appendChild(option);
    });
}

document.getElementById('malfunction-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const type = document.getElementById('malfunction-type').value;
    const km = document.getElementById('malfunction-km').value;
    const photoInput = document.getElementById('malfunction-photo');
    const notes = document.getElementById('malfunction-notes').value;
    
    if (!photoInput.files[0]) {
        showToast('Per favore allega una foto', 'error');
        return;
    }
    
    const malfunction = {
        id: Date.now().toString(),
        type: type,
        km: km,
        notes: notes,
        timestamp: new Date().toISOString()
    };
    
    if (type === 'illuminazione') {
        const faultType = document.getElementById('illuminazione-fault-type').value;
        malfunction.illuminazioneFaultType = faultType;
        
        if (faultType === 'corpi_illuminanti') {
            malfunction.corpiCount = document.getElementById('corpi-count').value;
        }
    }
    
    // Read photo
    const reader = new FileReader();
    reader.onload = (e) => {
        malfunction.photo = e.target.result;
        malfunctions.push(malfunction);
        saveMalfunctionsToLocalStorage();
        showToast('Segnalazione salvata con successo', 'success');
        closeMalfunctionModal();
    };
    reader.readAsDataURL(photoInput.files[0]);
});

// LocalStorage functions
function saveToLocalStorage() {
    localStorage.setItem('checklistData', JSON.stringify(checklistData));
}

function saveMalfunctionsToLocalStorage() {
    localStorage.setItem('malfunctions', JSON.stringify(malfunctions));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('checklistData');
    if (saved) {
        const savedData = JSON.parse(saved);
        
        savedData.forEach(savedItem => {
            const item = checklistData.find(i => i.id === savedItem.id);
            if (item) {
                Object.assign(item, savedItem);
                
                // Update UI
                Object.keys(item.checks).forEach(checkType => {
                    if (item.checks[checkType]) {
                        const radio = document.querySelector(`input[name="${checkType}-${item.id}"][value="${item.checks[checkType]}"]`);
                        if (radio) {
                            radio.checked = true;
                            handleCheck(item.id, checkType, item.checks[checkType]);
                        }
                    }
                });
                
                // Display photos
                Object.keys(item.photosByType).forEach(checkType => {
                    displayPhotos(item.id, checkType);
                });
                
                const itemEl = document.getElementById(`item-${item.id}`);
                if (itemEl && item.completed) {
                    itemEl.classList.add('completed');
                }
                
                updateMeta(item.id);
            }
        });
        
        updateProgress();
    }
    
    const savedMalfunctions = localStorage.getItem('malfunctions');
    if (savedMalfunctions) {
        malfunctions = JSON.parse(savedMalfunctions);
    }
}

// Report generation with photos
async function generateReport() {
    showToast('Generazione report PDF in corso...', 'success');
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    
    let y = 20;
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    
    // Header
    pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    pdf.text('REPORT VERIFICA APPRESTAMENTI TECNOLOGICI', pageWidth / 2, y, { align: 'center' });
    y += 10;
    
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Galleria di Base del Brennero (GGA)`, pageWidth / 2, y, { align: 'center' });
    y += 15;
    
    pdf.setFontSize(10);
    pdf.text(`Data Report: ${new Date().toLocaleString('it-IT')}`, margin, y);
    y += 6;
    
    const directionText = currentDirection === 'vernio' 
        ? 'Direzione: Vernio (37+259) → San Benedetto (55+742)'
        : 'Direzione: San Benedetto (55+742) → Vernio (37+259)';
    pdf.text(directionText, margin, y);
    y += 6;
    
    const completed = checklistData.filter(i => i.completed).length;
    pdf.text(`Nicchie Verificate: ${completed} / ${checklistData.length}`, margin, y);
    y += 15;
    
    // Summary
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('RIEPILOGO', margin, y);
    y += 8;
    
    pdf.setFontSize(9);
    pdf.setFont(undefined, 'normal');
    
    const problematicItems = checklistData.filter(item => {
        if (!item.completed) return false;
        for (const type of item.types) {
            const prefix = type === 'idrante' ? 'idrante' : (type === 'tem' ? 'tem' : 'quadro');
            if (item.checks[`${prefix}_stato`] === 'non_funzionante' ||
                item.checks[`${prefix}_sigillo`] === 'manomesso' ||
                item.checks[`${prefix}_segnaletica`] === 'assente') {
                return true;
            }
        }
        return false;
    });
    
    pdf.text(`Nicchie con problemi: ${problematicItems.length}`, margin, y);
    y += 6;
    pdf.text(`Segnalazioni malfunzionamenti: ${malfunctions.length}`, margin, y);
    y += 15;
    
    // Detailed list
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('DETTAGLIO VERIFICHE', margin, y);
    y += 10;
    
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'normal');
    
    for (const item of checklistData.filter(i => i.completed)) {
        // Check if we need a new page
        if (y > pageHeight - 40) {
            pdf.addPage();
            y = 20;
        }
        
        pdf.setFont(undefined, 'bold');
        pdf.setFontSize(9);
        pdf.text(`Km ${item.km} - Binario ${item.binario}`, margin, y);
        y += 6;
        
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(8);
        
        const typesLabel = item.types.map(t => {
            if (t === 'idrante') return 'Idrante VVF';
            if (t === 'tem') return 'TEM';
            return 'Quadro VVF';
        }).join(', ');
        pdf.text(`Apprestamenti: ${typesLabel}`, margin + 3, y);
        y += 5;
        
        // Details for each tech type with photos
        for (const type of item.types) {
            if (y > pageHeight - 80) {
                pdf.addPage();
                y = 20;
            }
            
            const prefix = type === 'idrante' ? 'idrante' : (type === 'tem' ? 'tem' : 'quadro');
            const label = type === 'idrante' ? 'Idrante VVF' : (type === 'tem' ? 'TEM' : 'Quadro VVF');
            
            pdf.setFont(undefined, 'bold');
            pdf.text(`  ${label}:`, margin + 3, y);
            y += 5;
            
            pdf.setFont(undefined, 'normal');
            
            // Stato
            const statoIcon = item.checks[`${prefix}_stato`] === 'funzionante' ? '✓' : '✗';
            const statoText = item.checks[`${prefix}_stato`] === 'funzionante' ? 'Funzionante' : 'Non Funzionante';
            pdf.text(`    ${statoIcon} Stato: ${statoText}`, margin + 5, y);
            y += 4;
            
            // Add photo if present
            if (item.photosByType[`${prefix}_stato`] && item.photosByType[`${prefix}_stato`].length > 0) {
                for (let photoData of item.photosByType[`${prefix}_stato`]) {
                    if (y > pageHeight - 70) {
                        pdf.addPage();
                        y = 20;
                    }
                    try {
                        pdf.addImage(photoData, 'JPEG', margin + 10, y, 40, 30);
                        y += 32;
                    } catch (e) {
                        pdf.text(`      [Foto allegata]`, margin + 10, y);
                        y += 4;
                    }
                }
            }
            
            // Sigillo
            const sigilloIcon = item.checks[`${prefix}_sigillo`] === 'integro' ? '✓' : '✗';
            const sigilloText = item.checks[`${prefix}_sigillo`] === 'integro' ? 'Integro' : 'Manomesso';
            pdf.text(`    ${sigilloIcon} Sigillo: ${sigilloText}`, margin + 5, y);
            y += 4;
            
            // Add photo if present
            if (item.photosByType[`${prefix}_sigillo`] && item.photosByType[`${prefix}_sigillo`].length > 0) {
                for (let photoData of item.photosByType[`${prefix}_sigillo`]) {
                    if (y > pageHeight - 70) {
                        pdf.addPage();
                        y = 20;
                    }
                    try {
                        pdf.addImage(photoData, 'JPEG', margin + 10, y, 40, 30);
                        y += 32;
                    } catch (e) {
                        pdf.text(`      [Foto allegata]`, margin + 10, y);
                        y += 4;
                    }
                }
            }
            
            // Segnaletica
            const segnIcon = item.checks[`${prefix}_segnaletica`] === 'presente' ? '✓' : '✗';
            const segnText = item.checks[`${prefix}_segnaletica`] === 'presente' ? 'Presente' : 'Assente';
            pdf.text(`    ${segnIcon} Segnaletica: ${segnText}`, margin + 5, y);
            y += 4;
            
            // Add photo if present
            if (item.photosByType[`${prefix}_segnaletica`] && item.photosByType[`${prefix}_segnaletica`].length > 0) {
                for (let photoData of item.photosByType[`${prefix}_segnaletica`]) {
                    if (y > pageHeight - 70) {
                        pdf.addPage();
                        y = 20;
                    }
                    try {
                        pdf.addImage(photoData, 'JPEG', margin + 10, y, 40, 30);
                        y += 32;
                    } catch (e) {
                        pdf.text(`      [Foto allegata]`, margin + 10, y);
                        y += 4;
                    }
                }
            }
            
            y += 2;
        }
        
        if (item.timestamp) {
            pdf.setFontSize(7);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Verificato: ${new Date(item.timestamp).toLocaleString('it-IT')}`, margin + 3, y);
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(8);
            y += 4;
        }
        
        y += 6;
    }
    
    // Malfunctions
    if (malfunctions.length > 0) {
        if (y > pageHeight - 40) {
            pdf.addPage();
            y = 20;
        }
        
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('SEGNALAZIONI MALFUNZIONAMENTI', margin, y);
        y += 10;
        
        pdf.setFontSize(8);
        pdf.setFont(undefined, 'normal');
        
        for (const m of malfunctions) {
            if (y > pageHeight - 60) {
                pdf.addPage();
                y = 20;
            }
            
            pdf.setFont(undefined, 'bold');
            pdf.setFontSize(9);
            const typeLabel = m.type === 'camminamento' ? 'Camminamento' : 
                             (m.type === 'corrimano' ? 'Corrimano' : 'Impianto Illuminazione');
            pdf.text(`${typeLabel}`, margin, y);
            y += 6;
            
            pdf.setFont(undefined, 'normal');
            pdf.setFontSize(8);
            pdf.text(`Progressiva: ${m.km}`, margin + 3, y);
            y += 4;
            
            if (m.illuminazioneFaultType) {
                const faultLabel = m.illuminazioneFaultType === 'fungo_blu' ? 'Fungo Blu' : 'Corpi Illuminanti';
                pdf.text(`Tipo guasto: ${faultLabel}`, margin + 3, y);
                y += 4;
                
                if (m.corpiCount) {
                    pdf.text(`Corpi non funzionanti: ${m.corpiCount}`, margin + 3, y);
                    y += 4;
                }
            }
            
            if (m.notes) {
                const lines = pdf.splitTextToSize(`Note: ${m.notes}`, maxWidth - 6);
                lines.forEach(line => {
                    if (y > pageHeight - 10) {
                        pdf.addPage();
                        y = 20;
                    }
                    pdf.text(line, margin + 3, y);
                    y += 4;
                });
            }
            
            // Add photo
            if (m.photo) {
                if (y > pageHeight - 50) {
                    pdf.addPage();
                    y = 20;
                }
                try {
                    pdf.addImage(m.photo, 'JPEG', margin + 5, y, 50, 37.5);
                    y += 40;
                } catch (e) {
                    pdf.text(`[Foto allegata]`, margin + 5, y);
                    y += 4;
                }
            }
            
            pdf.setFontSize(7);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Data: ${new Date(m.timestamp).toLocaleString('it-IT')}`, margin + 3, y);
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(8);
            y += 8;
        }
    }
    
    // Save PDF
    const fileName = `report_GGA_${currentDirection}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    showToast('Report PDF generato con successo!', 'success');
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Override generateReport to include photos
async function generateReportWithPhotos() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    
    let y = 20;
    const pageHeight = 280;
    const maxWidth = 170;
    
    // Header
    pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    pdf.text('REPORT VERIFICA APPRESTAMENTI TECNOLOGICI', 105, y, { align: 'center' });
    y += 12;
    
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Data: ${new Date().toLocaleString('it-IT')}`, 20, y);
    y += 6;
    
    const directionText = verificationDirection === 'vernio' ? 
        'Direzione: Vernio (37+259) → San Benedetto (55+742)' :
        'Direzione: San Benedetto (55+742) → Vernio (37+259)';
    pdf.text(directionText, 20, y);
    y += 10;
    
    const completed = checklistData.filter(i => i.completed).length;
    pdf.text(`Nicchie Verificate: ${completed} / ${checklistData.length}`, 20, y);
    y += 12;
    
    // Dettaglio nicchie con foto
    pdf.setFontSize(13);
    pdf.setFont(undefined, 'bold');
    pdf.text('DETTAGLIO VERIFICHE', 20, y);
    y += 8;
    
    pdf.setFontSize(9);
    pdf.setFont(undefined, 'normal');
    
    for (const item of checklistData.filter(i => i.completed)) {
        if (y > pageHeight) {
            pdf.addPage();
            y = 20;
        }
        
        pdf.setFont(undefined, 'bold');
        pdf.text(`Km ${item.km} - Binario ${item.binario}`, 20, y);
        y += 5;
        
        pdf.setFont(undefined, 'normal');
        const typesLabel = item.types.map(t => {
            if (t === 'idrante') return 'Idrante VVF';
            if (t === 'tem') return 'TEM';
            return 'Quadro VVF';
        }).join(', ');
        pdf.text(`Apprestamenti: ${typesLabel}`, 25, y);
        y += 5;
        
        // Dettagli verifiche
        for (const type of item.types) {
            const prefix = type === 'idrante' ? 'idrante' : (type === 'tem' ? 'tem' : 'quadro');
            const label = type === 'idrante' ? 'Idrante VVF' : (type === 'tem' ? 'TEM' : 'Quadro VVF');
            
            if (y > pageHeight - 20) {
                pdf.addPage();
                y = 20;
            }
            
            pdf.text(`  ${label}:`, 25, y);
            y += 4;
            
            const stato = item.checks[`${prefix}_stato`] === 'funzionante' ? 'Funzionante' : 'Non Funzionante';
            const sigillo = item.checks[`${prefix}_sigillo`] === 'integro' ? 'Integro' : 'Manomesso';
            const segnaletica = item.checks[`${prefix}_segnaletica`] === 'presente' ? 'Presente' : 'Assente';
            
            pdf.text(`    Stato: ${stato}`, 30, y);
            y += 4;
            pdf.text(`    Sigillo: ${sigillo}`, 30, y);
            y += 4;
            pdf.text(`    Segnaletica: ${segnaletica}`, 30, y);
            y += 4;
            
            // Aggiungi foto se presenti
            const photoTypes = [`${prefix}_stato`, `${prefix}_sigillo`, `${prefix}_segnaletica`];
            for (const photoType of photoTypes) {
                const photos = item.photosByType[photoType] || [];
                if (photos.length > 0) {
                    const photoLabel = photoType.split('_')[1];
                    pdf.text(`    Foto ${photoLabel}: ${photos.length}`, 30, y);
                    y += 4;
                    
                    // Aggiungi miniature foto (max 2 per pagina per spazio)
                    for (let i = 0; i < Math.min(photos.length, 2); i++) {
                        if (y > pageHeight - 60) {
                            pdf.addPage();
                            y = 20;
                        }
                        
                        try {
                            pdf.addImage(photos[i], 'JPEG', 30, y, 50, 40);
                            y += 42;
                        } catch (e) {
                            console.error('Errore aggiunta foto:', e);
                            pdf.text(`      [Foto ${i+1}]`, 30, y);
                            y += 4;
                        }
                    }
                    
                    if (photos.length > 2) {
                        pdf.text(`      ... e altre ${photos.length - 2} foto`, 30, y);
                        y += 4;
                    }
                }
            }
        }
        
        y += 3;
    }
    
    // Malfunzionamenti
    if (malfunctions.length > 0) {
        if (y > pageHeight - 30) {
            pdf.addPage();
            y = 20;
        }
        
        y += 5;
        pdf.setFontSize(13);
        pdf.setFont(undefined, 'bold');
        pdf.text('SEGNALAZIONI MALFUNZIONAMENTI', 20, y);
        y += 8;
        
        pdf.setFontSize(9);
        pdf.setFont(undefined, 'normal');
        
        for (const m of malfunctions) {
            if (y > pageHeight - 60) {
                pdf.addPage();
                y = 20;
            }
            
            pdf.setFont(undefined, 'bold');
            const typeLabel = m.type === 'camminamento' ? 'Camminamento' : 
                             (m.type === 'corrimano' ? 'Corrimano' : 'Illuminazione');
            pdf.text(`Tipo: ${typeLabel}`, 20, y);
            y += 5;
            
            pdf.setFont(undefined, 'normal');
            pdf.text(`Progressiva: ${m.km}`, 25, y);
            y += 4;
            
            if (m.illuminazioneFaultType) {
                const fault = m.illuminazioneFaultType === 'fungo_blu' ? 'Fungo Blu' : 'Corpi Illuminanti';
                pdf.text(`Guasto: ${fault}`, 25, y);
                y += 4;
                
                if (m.corpiCount) {
                    pdf.text(`Corpi non funzionanti: ${m.corpiCount}`, 25, y);
                    y += 4;
                }
            }
            
            if (m.notes) {
                const lines = pdf.splitTextToSize(`Note: ${m.notes}`, maxWidth);
                lines.forEach(line => {
                    if (y > pageHeight - 5) {
                        pdf.addPage();
                        y = 20;
                    }
                    pdf.text(line, 25, y);
                    y += 4;
                });
            }
            
            // Aggiungi foto malfunzionamento
            if (m.photo) {
                if (y > pageHeight - 50) {
                    pdf.addPage();
                    y = 20;
                }
                
                try {
                    pdf.addImage(m.photo, 'JPEG', 25, y, 60, 45);
                    y += 47;
                } catch (e) {
                    console.error('Errore aggiunta foto malfunzionamento:', e);
                    pdf.text('  [Foto allegata]', 25, y);
                    y += 4;
                }
            }
            
            pdf.text(`Data: ${new Date(m.timestamp).toLocaleString('it-IT')}`, 25, y);
            y += 8;
        }
    }
    
    // Save
    const filename = `report_GGA_${verificationDirection}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
    
    showToast('Report PDF generato con successo (con foto)', 'success');
}

// Alias per retrocompatibilità
const generateReport = generateReportWithPhotos;

// Feedback functions
let userRating = 0;

function setRating(rating) {
    userRating = rating;
    document.getElementById('feedback-rating').value = rating;
    
    for (let i = 1; i <= 5; i++) {
        const star = document.getElementById(`star-${i}`).parentElement;
        if (i <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    }
}

function openFeedbackModal() {
    document.getElementById('feedback-modal').classList.add('show');
}

function closeFeedbackModal() {
    document.getElementById('feedback-modal').classList.remove('show');
    document.getElementById('feedback-form').reset();
    userRating = 0;
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`star-${i}`).parentElement.classList.remove('active');
    }
}

function skipFeedbackAndGenerate() {
    closeFeedbackModal();
    actuallyGenerateReport(null);
}

document.getElementById('feedback-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const feedback = {
        problems: document.getElementById('feedback-problems').value,
        suggestions: document.getElementById('feedback-suggestions').value,
        rating: userRating,
        timestamp: new Date().toISOString()
    };
    
    // Salva feedback in localStorage
    let allFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
    allFeedback.push(feedback);
    localStorage.setItem('userFeedback', JSON.stringify(allFeedback));
    
    showToast('Grazie per il tuo feedback!', 'success');
    closeFeedbackModal();
    actuallyGenerateReport(feedback);
});

// Override della funzione generateReport per mostrare modal feedback
const originalGenerateReport = generateReport;

function generateReport() {
    // Controlla se ci sono nicchie verificate
    const verifiedNiches = checklistData.filter(i => i.completed);
    
    if (verifiedNiches.length === 0) {
        alert('Nessuna nicchia verificata. Completa almeno una verifica prima di generare il report.');
        return;
    }
    
    // Mostra modal feedback
    openFeedbackModal();
}

// Funzione che genera effettivamente il report (SOLO NICCHIE VERIFICATE)
async function actuallyGenerateReport(feedback) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    
    let y = 20;
    const pageHeight = 280;
    const maxWidth = 170;
    
    // Header
    pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    pdf.text('REPORT VERIFICA APPRESTAMENTI GGA', 105, y, { align: 'center' });
    y += 12;
    
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Data: ${new Date().toLocaleString('it-IT')}`, 20, y);
    y += 6;
    
    const directionText = verificationDirection === 'vernio' ? 
        'Direzione: Vernio (37+259) → San Benedetto (55+742)' :
        'Direzione: San Benedetto (55+742) → Vernio (37+259)';
    pdf.text(directionText, 20, y);
    y += 10;
    
    const verifiedNiches = checklistData.filter(i => i.completed);
    const totalNiches = checklistData.length;
    pdf.text(`Nicchie Verificate: ${verifiedNiches.length} / ${totalNiches}`, 20, y);
    y += 6;
    pdf.text(`Operatore: ${feedback && feedback.rating ? `Valutazione app: ${'⭐'.repeat(feedback.rating)}` : 'N/D'}`, 20, y);
    y += 12;
    
    // SOLO NICCHIE VERIFICATE
    pdf.setFontSize(13);
    pdf.setFont(undefined, 'bold');
    pdf.text(`DETTAGLIO VERIFICHE (${verifiedNiches.length} nicchie)`, 20, y);
    y += 8;
    
    pdf.setFontSize(9);
    pdf.setFont(undefined, 'normal');
    
    for (const item of verifiedNiches) {
        if (y > pageHeight) {
            pdf.addPage();
            y = 20;
        }
        
        pdf.setFont(undefined, 'bold');
        pdf.text(`Km ${item.km} - Binario ${item.binario}`, 20, y);
        y += 5;
        
        pdf.setFont(undefined, 'normal');
        const typesLabel = item.types.map(t => {
            if (t === 'idrante') return 'Idrante VVF';
            if (t === 'tem') return 'TEM';
            return 'Quadro VVF';
        }).join(', ');
        pdf.text(`Apprestamenti: ${typesLabel}`, 25, y);
        y += 5;
        
        if (item.timestamp) {
            pdf.text(`Verificata: ${new Date(item.timestamp).toLocaleString('it-IT')}`, 25, y);
            y += 5;
        }
        
        // Dettagli verifiche
        for (const type of item.types) {
            const prefix = type === 'idrante' ? 'idrante' : (type === 'tem' ? 'tem' : 'quadro');
            const label = type === 'idrante' ? 'Idrante VVF' : (type === 'tem' ? 'TEM' : 'Quadro VVF');
            
            if (y > pageHeight - 20) {
                pdf.addPage();
                y = 20;
            }
            
            pdf.text(`  ${label}:`, 25, y);
            y += 4;
            
            const stato = item.checks[`${prefix}_stato`] === 'funzionante' ? '✓ Funzionante' : '✗ Non Funzionante';
            const sigillo = item.checks[`${prefix}_sigillo`] === 'integro' ? '✓ Integro' : '✗ Manomesso';
            const segnaletica = item.checks[`${prefix}_segnaletica`] === 'presente' ? '✓ Presente' : '✗ Assente';
            
            pdf.text(`    Stato: ${stato}`, 30, y);
            y += 4;
            pdf.text(`    Sigillo: ${sigillo}`, 30, y);
            y += 4;
            pdf.text(`    Segnaletica: ${segnaletica}`, 30, y);
            y += 4;
            
            // Aggiungi foto se presenti
            const photoTypes = [`${prefix}_stato`, `${prefix}_sigillo`, `${prefix}_segnaletica`];
            for (const photoType of photoTypes) {
                const photos = item.photosByType[photoType] || [];
                if (photos.length > 0) {
                    const photoLabel = photoType.split('_')[1];
                    pdf.setFont(undefined, 'italic');
                    pdf.text(`    Foto ${photoLabel}: ${photos.length}`, 30, y);
                    pdf.setFont(undefined, 'normal');
                    y += 4;
                    
                    // Aggiungi miniature foto (max 2 per nicchia per gestire spazio)
                    for (let i = 0; i < Math.min(photos.length, 2); i++) {
                        if (y > pageHeight - 50) {
                            pdf.addPage();
                            y = 20;
                        }
                        
                        try {
                            pdf.addImage(photos[i], 'JPEG', 35, y, 45, 35);
                            y += 37;
                        } catch (e) {
                            console.error('Errore aggiunta foto:', e);
                            pdf.text(`      [Foto ${i+1}]`, 35, y);
                            y += 4;
                        }
                    }
                    
                    if (photos.length > 2) {
                        pdf.setFont(undefined, 'italic');
                        pdf.text(`      ... e altre ${photos.length - 2} foto`, 35, y);
                        pdf.setFont(undefined, 'normal');
                        y += 4;
                    }
                }
            }
        }
        
        y += 3;
    }
    
    // Malfunzionamenti
    if (malfunctions.length > 0) {
        if (y > pageHeight - 30) {
            pdf.addPage();
            y = 20;
        }
        
        y += 5;
        pdf.setFontSize(13);
        pdf.setFont(undefined, 'bold');
        pdf.text(`SEGNALAZIONI MALFUNZIONAMENTI (${malfunctions.length})`, 20, y);
        y += 8;
        
        pdf.setFontSize(9);
        pdf.setFont(undefined, 'normal');
        
        for (const m of malfunctions) {
            if (y > pageHeight - 60) {
                pdf.addPage();
                y = 20;
            }
            
            pdf.setFont(undefined, 'bold');
            const typeLabel = m.type === 'camminamento' ? 'Camminamento' : 
                             (m.type === 'corrimano' ? 'Corrimano' : 'Illuminazione');
            pdf.text(`Tipo: ${typeLabel}`, 20, y);
            y += 5;
            
            pdf.setFont(undefined, 'normal');
            pdf.text(`Progressiva: ${m.km}`, 25, y);
            y += 4;
            
            if (m.illuminazioneFaultType) {
                const fault = m.illuminazioneFaultType === 'fungo_blu' ? 'Fungo Blu' : 'Corpi Illuminanti';
                pdf.text(`Guasto: ${fault}`, 25, y);
                y += 4;
                
                if (m.corpiCount) {
                    pdf.text(`Corpi non funzionanti: ${m.corpiCount}`, 25, y);
                    y += 4;
                }
            }
            
            if (m.notes) {
                const lines = pdf.splitTextToSize(`Note: ${m.notes}`, maxWidth);
                lines.forEach(line => {
                    if (y > pageHeight - 5) {
                        pdf.addPage();
                        y = 20;
                    }
                    pdf.text(line, 25, y);
                    y += 4;
                });
            }
            
            // Aggiungi foto malfunzionamento
            if (m.photo) {
                if (y > pageHeight - 45) {
                    pdf.addPage();
                    y = 20;
                }
                
                try {
                    pdf.addImage(m.photo, 'JPEG', 25, y, 55, 40);
                    y += 42;
                } catch (e) {
                    console.error('Errore aggiunta foto malfunzionamento:', e);
                    pdf.text('  [Foto allegata]', 25, y);
                    y += 4;
                }
            }
            
            pdf.text(`Data: ${new Date(m.timestamp).toLocaleString('it-IT')}`, 25, y);
            y += 8;
        }
    }
    
    // Feedback utente (se presente)
    if (feedback && (feedback.problems || feedback.suggestions)) {
        if (y > pageHeight - 40) {
            pdf.addPage();
            y = 20;
        }
        
        y += 10;
        pdf.setFontSize(13);
        pdf.setFont(undefined, 'bold');
        pdf.text('FEEDBACK OPERATORE', 20, y);
        y += 8;
        
        pdf.setFontSize(9);
        pdf.setFont(undefined, 'normal');
        
        if (feedback.rating > 0) {
            pdf.text(`Valutazione app: ${'⭐'.repeat(feedback.rating)} (${feedback.rating}/5)`, 20, y);
            y += 6;
        }
        
        if (feedback.problems) {
            pdf.setFont(undefined, 'bold');
            pdf.text('Problemi riscontrati:', 20, y);
            y += 5;
            pdf.setFont(undefined, 'normal');
            const problemLines = pdf.splitTextToSize(feedback.problems, maxWidth);
            problemLines.forEach(line => {
                if (y > pageHeight - 5) {
                    pdf.addPage();
                    y = 20;
                }
                pdf.text(line, 25, y);
                y += 4;
            });
            y += 3;
        }
        
        if (feedback.suggestions) {
            if (y > pageHeight - 20) {
                pdf.addPage();
                y = 20;
            }
            pdf.setFont(undefined, 'bold');
            pdf.text('Suggerimenti:', 20, y);
            y += 5;
            pdf.setFont(undefined, 'normal');
            const suggestionLines = pdf.splitTextToSize(feedback.suggestions, maxWidth);
            suggestionLines.forEach(line => {
                if (y > pageHeight - 5) {
                    pdf.addPage();
                    y = 20;
                }
                pdf.text(line, 25, y);
                y += 4;
            });
        }
    }
    
    // Footer
    if (y > pageHeight - 15) {
        pdf.addPage();
        y = 20;
    }
    y = pageHeight - 10;
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'italic');
    pdf.text(`Report generato da NicheSafe - ${new Date().toLocaleString('it-IT')}`, 105, y, { align: 'center' });
    
    // Save
    const directionSuffix = verificationDirection === 'vernio' ? 'vernio-sambro' : 'sambro-vernio';
    const filename = `report_GGA_${directionSuffix}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
    
    showToast(`Report PDF generato: ${verifiedNiches.length} nicchie verificate`, 'success');
}

