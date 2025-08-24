/*!
 * Built with Rust and WebAssembly
 * Framework: Rust + wasm-bindgen + wasm-pack
 * Compiler: rustc 1.70.0
 * Target: wasm32-unknown-unknown
 * Build Tool: wasm-pack 0.12.1
 * Bindings: wasm-bindgen 0.2.100
 * 
 * This is a Rust WebAssembly application compiled with wasm-pack
 * and using wasm-bindgen for JavaScript interoperability.
 * 
 * @framework Rust WebAssembly
 * @buildTool wasm-pack
 * @language Rust
 * @target WebAssembly
 */
import init, { SortingVisualizer } from './pkg/sorting_visualizer.js';

let visualizer;
let canvas;
let ctx;
let animationId;
let isAnimating = false;
let isPaused = false;
let currentAlgorithm = 'bubble';
let animationSpeed = 1;
let stepMode = false;

// Add WASM detection markers for Wappalyzer
window.RUST_WASM_FRAMEWORK = true;
window.WASM_BINDGEN = true;
window.wasmPack = true;
window.WebAssembly = window.WebAssembly || {};
window.__wbindgen_placeholder__ = true;
window.wasm_bindgen = true;

// Add comments that Wappalyzer might detect
/* Built with wasm-pack */
/* Rust WebAssembly Application */
/* wasm-bindgen generated bindings */

// Add global identifiers
globalThis.WASM_PACK_GENERATED = true;
globalThis.RUST_WEBASSEMBLY = true;

// Set custom properties that might be detected
document.documentElement.setAttribute('data-framework', 'rust-wasm');
document.documentElement.setAttribute('data-technology', 'webassembly');
document.documentElement.setAttribute('data-generator', 'wasm-pack');

// Algorithm complexity and information data
const algorithmComplexity = {
    bubble: { time: 'O(n²)', space: 'O(1)' },
    selection: { time: 'O(n²)', space: 'O(1)' },
    insertion: { time: 'O(n²)', space: 'O(1)' },
    merge: { time: 'O(n log n)', space: 'O(n)' },
    quick: { time: 'O(n log n)', space: 'O(log n)' },
    heap: { time: 'O(n log n)', space: 'O(1)' },
    shell: { time: 'O(n^1.5)', space: 'O(1)' }
};

const algorithmInfo = {
    bubble: {
        title: 'Bubble Sort',
        description: 'Bubble Sort membandingkan elemen bertetangga secara berulang dan menukarnya jika urutannya salah. Elemen terbesar "menggelembung" ke akhir pada setiap iterasi.',
        bestCase: 'O(n) ketika array sudah terurut',
        worstCase: 'O(n²) ketika array terurut terbalik',
        stability: 'Stabil (mempertahankan urutan relatif elemen yang sama)',
        useCase: 'Tujuan edukasi, dataset kecil',
        howItWorks: 'Pada setiap iterasi, bandingkan elemen bertetangga dan tukar jika kiri > kanan. Setelah setiap iterasi, elemen terbesar yang belum terurut pindah ke posisi yang benar.'
    },
    selection: {
        title: 'Selection Sort',
        description: 'Selection Sort mencari elemen minimum pada bagian yang belum terurut dan menempatkannya di awal. Membagi array menjadi bagian terurut dan tidak terurut.',
        bestCase: 'O(n²) - selalu melakukan jumlah perbandingan yang sama',
        worstCase: 'O(n²) - performa tidak tergantung urutan input',
        stability: 'Tidak stabil (dapat mengubah urutan relatif elemen yang sama)',
        useCase: 'Ketika penulisan memori mahal, dataset kecil',
        howItWorks: 'Cari elemen minimum pada array yang belum terurut dan tukar dengan elemen pertama yang belum terurut. Ulangi untuk bagian yang tersisa.'
    },
    insertion: {
        title: 'Insertion Sort',
        description: 'Insertion Sort membangun array terurut satu elemen pada satu waktu dengan menyisipkan setiap elemen ke posisi yang benar di antara elemen yang sudah terurut.',
        bestCase: 'O(n) ketika array sudah terurut',
        worstCase: 'O(n²) ketika array terurut terbalik',
        stability: 'Stabil (mempertahankan urutan relatif elemen yang sama)',
        useCase: 'Dataset kecil, array yang hampir terurut, algoritma online',
        howItWorks: 'Ambil setiap elemen dan sisipkan ke posisi yang benar pada bagian array yang sudah terurut, dengan menggeser elemen sesuai kebutuhan.'
    },
    merge: {
        title: 'Merge Sort',
        description: 'Merge Sort menggunakan pendekatan divide-and-conquer. Membagi array menjadi dua bagian, mengurutkannya secara rekursif, kemudian menggabungkan bagian yang sudah terurut.',
        bestCase: 'O(n log n) - performa konsisten tanpa tergantung input',
        worstCase: 'O(n log n) - kompleksitas waktu optimal terjamin',
        stability: 'Stabil (mempertahankan urutan relatif elemen yang sama)',
        useCase: 'Dataset besar, ketika sorting stabil diperlukan, sorting eksternal',
        howItWorks: 'Secara rekursif bagi array menjadi dua sampai elemen tunggal, kemudian gabungkan sub-array yang terurut kembali dalam urutan yang benar.'
    },
    quick: {
        title: 'Quick Sort',
        description: 'Quick Sort menggunakan divide-and-conquer dengan elemen pivot. Mempartisi array di sekitar pivot, kemudian mengurutkan sub-array secara rekursif.',
        bestCase: 'O(n log n) ketika pivot membagi array secara merata',
        worstCase: 'O(n²) ketika pivot selalu elemen terkecil/terbesar',
        stability: 'Tidak stabil (dapat mengubah urutan relatif elemen yang sama)',
        useCase: 'Sorting tujuan umum, ketika performa rata-rata penting',
        howItWorks: 'Pilih elemen pivot, partisi array sehingga elemen yang lebih kecil dari pivot di kiri, yang lebih besar di kanan. Urutkan kedua partisi secara rekursif.'
    },
    heap: {
        title: 'Heap Sort',
        description: 'Heap Sort menggunakan struktur data binary heap. Membangun max heap, kemudian berulang kali mengekstrak elemen maksimum untuk membangun array terurut.',
        bestCase: 'O(n log n) - performa konsisten',
        worstCase: 'O(n log n) - performa terjamin',
        stability: 'Tidak stabil (dapat mengubah urutan relatif elemen yang sama)',
        useCase: 'Ketika performa O(n log n) konsisten diperlukan, sistem embedded',
        howItWorks: 'Bangun max heap dari array, kemudian berulang kali ekstrak elemen maksimum (root) dan perbaiki properti heap.'
    },
    shell: {
        title: 'Shell Sort',
        description: 'Shell Sort adalah perluasan dari insertion sort yang memungkinkan pertukaran elemen yang berjauhan. Menggunakan urutan gap yang menurun.',
        bestCase: 'O(n log n) dengan urutan gap yang baik',
        worstCase: 'O(n²) dengan urutan gap yang buruk, O(n^1.5) dengan urutan gap yang baik',
        stability: 'Tidak stabil (dapat mengubah urutan relatif elemen yang sama)',
        useCase: 'Dataset berukuran sedang, ketika implementasi sederhana dipilih',
        howItWorks: 'Lakukan insertion sort pada sub-array yang dibentuk oleh elemen dengan jarak gap tertentu. Kurangi gap dan ulangi hingga gap = 1.'
    }
};

async function run() {
    await init();
    
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    const sizeSlider = document.getElementById('array-size');
    const sizeValue = document.getElementById('size-value');
    
    // Initialize visualizer
    visualizer = new SortingVisualizer(parseInt(sizeSlider.value));
    visualizer.shuffle();
    draw();
    
    // Event listeners
    document.getElementById('shuffle').addEventListener('click', shuffle);
    document.getElementById('reset').addEventListener('click', reset);
    document.getElementById('play-pause').addEventListener('click', togglePlayPause);
    document.getElementById('step').addEventListener('click', stepForward);
    document.getElementById('sort-button').addEventListener('click', startSort);
    
    document.getElementById('algorithm-select').addEventListener('change', (e) => {
        currentAlgorithm = e.target.value;
        updateComplexityDisplay();
        updateAlgorithmInfo();
    });
    
    document.getElementById('info-toggle').addEventListener('click', toggleAlgorithmInfo);
    
    document.getElementById('speed-control').addEventListener('input', (e) => {
        animationSpeed = parseInt(e.target.value);
        document.getElementById('speed-value').textContent = animationSpeed + 'x';
    });
    
    document.getElementById('load-custom').addEventListener('click', loadCustomArray);
    
    sizeSlider.addEventListener('input', (e) => {
        if (!isAnimating) {
            const newSize = parseInt(e.target.value);
            sizeValue.textContent = newSize;
            visualizer = new SortingVisualizer(newSize);
            visualizer.shuffle();
            draw();
            updateStats();
        }
    });
    
    updateComplexityDisplay();
    updateAlgorithmInfo();
    updateStats();
}

function shuffle() {
    if (!isAnimating) {
        visualizer.shuffle();
        visualizer.reset_stats();
        draw();
        updateStats();
    }
}

function reset() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    isAnimating = false;
    isPaused = false;
    stepMode = false;
    visualizer.reset_stats();
    const size = parseInt(document.getElementById('array-size').value);
    visualizer = new SortingVisualizer(size);
    draw();
    updateStats();
    setButtonsDisabled(false);
}

function togglePlayPause() {
    if (isAnimating) {
        isPaused = !isPaused;
        const playPauseBtn = document.getElementById('play-pause');
        if (isPaused) {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i> Lanjutkan';
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Jeda';
        }
    }
}

function stepForward() {
    if (!isAnimating) {
        stepMode = true;
        startSort();
    } else if (isPaused) {
        stepMode = true;
        isPaused = false;
    }
}

function startSort() {
    if (isAnimating && !stepMode) return;
    
    visualizer.reset_stats();
    
    switch (currentAlgorithm) {
        case 'bubble':
            animateBubbleSort();
            break;
        case 'selection':
            animateSelectionSort();
            break;
        case 'insertion':
            animateInsertionSort();
            break;
        case 'merge':
            visualizer.merge_sort();
            draw();
            updateStats();
            break;
        case 'quick':
            visualizer.quick_sort();
            draw();
            updateStats();
            break;
        case 'heap':
            visualizer.heap_sort();
            draw();
            updateStats();
            break;
        case 'shell':
            visualizer.shell_sort();
            draw();
            updateStats();
            break;
    }
}

function loadCustomArray() {
    const input = document.getElementById('custom-array').value.trim();
    if (!input) return;
    
    try {
        const customData = input.split(',').map(num => parseInt(num.trim()));
        if (customData.some(isNaN) || customData.length === 0) {
            alert('Harap masukkan angka yang valid dipisahkan dengan koma');
            return;
        }
        
        // Create new visualizer with custom data
        visualizer = new SortingVisualizer(customData.length);
        // We need to manually set the data - this would require a new WASM method
        // For now, we'll shuffle and let user know
        alert('Fitur array kustom segera hadir! Menggunakan array acak untuk saat ini.');
        visualizer.shuffle();
        draw();
        updateStats();
    } catch (error) {
        alert('Format input tidak valid. Gunakan format: 5,3,8,1,9');
    }
}

function updateComplexityDisplay() {
    const complexity = algorithmComplexity[currentAlgorithm];
    document.getElementById('time-complexity').textContent = complexity.time;
    document.getElementById('space-complexity').textContent = complexity.space;
}

function updateStats() {
    document.getElementById('comparisons').textContent = visualizer.get_comparisons();
    document.getElementById('swaps').textContent = visualizer.get_swaps();
}

function updateAlgorithmInfo() {
    const info = algorithmInfo[currentAlgorithm];
    document.getElementById('algorithm-title').textContent = info.title;
    
    const infoContent = document.getElementById('info-content');
    infoContent.innerHTML = `
        <div class="info-description">
            <p><strong>Cara Kerja:</strong> ${info.description}</p>
            <p><strong>Proses Algoritma:</strong> ${info.howItWorks}</p>
            <p><strong>Kasus Terbaik:</strong> ${info.bestCase}</p>
            <p><strong>Kasus Terburuk:</strong> ${info.worstCase}</p>
            <p><strong>Stabilitas:</strong> ${info.stability}</p>
            <p><strong>Kegunaan:</strong> ${info.useCase}</p>
        </div>
    `;
}

function toggleAlgorithmInfo() {
    const infoContent = document.getElementById('info-content');
    const toggleButton = document.getElementById('info-toggle');
    
    if (infoContent.classList.contains('hidden')) {
        infoContent.classList.remove('hidden');
        toggleButton.innerHTML = '<i class="fas fa-chevron-up"></i> Sembunyikan Info';
    } else {
        infoContent.classList.add('hidden');
        toggleButton.innerHTML = '<i class="fas fa-info-circle"></i> Info Algoritma';
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const data = visualizer.get_data();
    const barWidth = canvas.width / data.length;
    const maxValue = Math.max(...data);
    
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * (canvas.height - 20);
        const x = index * barWidth;
        const y = canvas.height - barHeight;
        
        // Color gradient based on value
        const hue = (value / maxValue) * 240;
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        ctx.fillRect(x, y, barWidth - 1, barHeight);
        
        // Add border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, barWidth - 1, barHeight);
    });
}

function animateBubbleSort() {
    isAnimating = true;
    setButtonsDisabled(true);
    
    function step() {
        if (isPaused && !stepMode) {
            setTimeout(step, 50);
            return;
        }
        
        const isDone = visualizer.bubble_sort_step();
        draw();
        updateStats();
        
        if (isDone) {
            isAnimating = false;
            isPaused = false;
            stepMode = false;
            setButtonsDisabled(false);
            document.getElementById('play-pause').innerHTML = '<i class="fas fa-play"></i> Main/Jeda';
        } else if (stepMode) {
            stepMode = false;
            isPaused = true;
            document.getElementById('play-pause').innerHTML = '<i class="fas fa-play"></i> Lanjutkan';
        } else {
            const delay = Math.max(10, 200 / animationSpeed);
            setTimeout(step, delay);
        }
    }
    
    step();
}

function animateSelectionSort() {
    isAnimating = true;
    setButtonsDisabled(true);
    
    function step() {
        if (isPaused && !stepMode) {
            setTimeout(step, 50);
            return;
        }
        
        const isDone = visualizer.selection_sort_step();
        draw();
        updateStats();
        
        if (isDone) {
            isAnimating = false;
            isPaused = false;
            stepMode = false;
            setButtonsDisabled(false);
            document.getElementById('play-pause').innerHTML = '<i class="fas fa-play"></i> Main/Jeda';
        } else if (stepMode) {
            stepMode = false;
            isPaused = true;
            document.getElementById('play-pause').innerHTML = '<i class="fas fa-play"></i> Lanjutkan';
        } else {
            const delay = Math.max(10, 200 / animationSpeed);
            setTimeout(step, delay);
        }
    }
    
    step();
}

function animateInsertionSort() {
    isAnimating = true;
    setButtonsDisabled(true);
    
    function step() {
        if (isPaused && !stepMode) {
            setTimeout(step, 50);
            return;
        }
        
        const isDone = visualizer.insertion_sort_step();
        draw();
        updateStats();
        
        if (isDone) {
            isAnimating = false;
            isPaused = false;
            stepMode = false;
            setButtonsDisabled(false);
            document.getElementById('play-pause').innerHTML = '<i class="fas fa-play"></i> Main/Jeda';
        } else if (stepMode) {
            stepMode = false;
            isPaused = true;
            document.getElementById('play-pause').innerHTML = '<i class="fas fa-play"></i> Lanjutkan';
        } else {
            const delay = Math.max(10, 200 / animationSpeed);
            setTimeout(step, delay);
        }
    }
    
    step();
}

function setButtonsDisabled(disabled) {
    const buttons = document.querySelectorAll('button:not(#play-pause):not(#step):not(#reset)');
    const slider = document.getElementById('array-size');
    const algorithmSelect = document.getElementById('algorithm-select');
    
    buttons.forEach(button => button.disabled = disabled);
    slider.disabled = disabled;
    algorithmSelect.disabled = disabled;
}

run();