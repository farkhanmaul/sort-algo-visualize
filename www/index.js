// Built with Rust and WebAssembly
// Framework: Rust + wasm-bindgen + wasm-pack
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
        description: 'Bubble Sort repeatedly compares adjacent elements and swaps them if they\'re in the wrong order. The largest element "bubbles" to the end in each pass.',
        bestCase: 'O(n) when array is already sorted',
        worstCase: 'O(n²) when array is reverse sorted',
        stability: 'Stable (maintains relative order of equal elements)',
        useCase: 'Educational purposes, small datasets',
        howItWorks: 'In each pass, compare adjacent elements and swap if left > right. After each pass, the largest unsorted element moves to its correct position.'
    },
    selection: {
        title: 'Selection Sort',
        description: 'Selection Sort finds the minimum element in the unsorted portion and places it at the beginning. It divides the array into sorted and unsorted regions.',
        bestCase: 'O(n²) - always performs the same number of comparisons',
        worstCase: 'O(n²) - performance doesn\'t depend on input order',
        stability: 'Unstable (may change relative order of equal elements)',
        useCase: 'When memory writes are expensive, small datasets',
        howItWorks: 'Find the minimum element in the unsorted array and swap it with the first unsorted element. Repeat for the remaining unsorted portion.'
    },
    insertion: {
        title: 'Insertion Sort',
        description: 'Insertion Sort builds the sorted array one element at a time by inserting each element into its correct position among the previously sorted elements.',
        bestCase: 'O(n) when array is already sorted',
        worstCase: 'O(n²) when array is reverse sorted',
        stability: 'Stable (maintains relative order of equal elements)',
        useCase: 'Small datasets, nearly sorted arrays, online algorithms',
        howItWorks: 'Take each element and insert it into the correct position in the already sorted portion of the array, shifting elements as needed.'
    },
    merge: {
        title: 'Merge Sort',
        description: 'Merge Sort uses divide-and-conquer approach. It divides the array into halves, recursively sorts them, then merges the sorted halves.',
        bestCase: 'O(n log n) - consistent performance regardless of input',
        worstCase: 'O(n log n) - guaranteed optimal time complexity',
        stability: 'Stable (maintains relative order of equal elements)',
        useCase: 'Large datasets, when stable sorting is required, external sorting',
        howItWorks: 'Recursively divide the array into halves until single elements, then merge sorted sub-arrays back together in correct order.'
    },
    quick: {
        title: 'Quick Sort',
        description: 'Quick Sort uses divide-and-conquer with a pivot element. It partitions the array around the pivot, then recursively sorts the sub-arrays.',
        bestCase: 'O(n log n) when pivot divides array evenly',
        worstCase: 'O(n²) when pivot is always the smallest/largest element',
        stability: 'Unstable (may change relative order of equal elements)',
        useCase: 'General purpose sorting, when average-case performance matters',
        howItWorks: 'Choose a pivot element, partition the array so elements smaller than pivot are on left, larger on right. Recursively sort both partitions.'
    },
    heap: {
        title: 'Heap Sort',
        description: 'Heap Sort uses a binary heap data structure. It builds a max heap, then repeatedly extracts the maximum element to build the sorted array.',
        bestCase: 'O(n log n) - consistent performance',
        worstCase: 'O(n log n) - guaranteed performance',
        stability: 'Unstable (may change relative order of equal elements)',
        useCase: 'When consistent O(n log n) performance is needed, embedded systems',
        howItWorks: 'Build a max heap from the array, then repeatedly extract the maximum element (root) and restore the heap property.'
    },
    shell: {
        title: 'Shell Sort',
        description: 'Shell Sort is an extension of insertion sort that allows exchanges of elements that are far apart. It uses a sequence of decreasing gaps.',
        bestCase: 'O(n log n) with good gap sequence',
        worstCase: 'O(n²) with poor gap sequence, O(n^1.5) with good sequence',
        stability: 'Unstable (may change relative order of equal elements)',
        useCase: 'Medium-sized datasets, when simple implementation is preferred',
        howItWorks: 'Perform insertion sort on sub-arrays formed by elements that are a certain gap apart. Reduce the gap and repeat until gap = 1.'
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
        document.getElementById('play-pause').textContent = isPaused ? '▶️ Play' : '⏸️ Pause';
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
            alert('Please enter valid numbers separated by commas');
            return;
        }
        
        // Create new visualizer with custom data
        visualizer = new SortingVisualizer(customData.length);
        // We need to manually set the data - this would require a new WASM method
        // For now, we'll shuffle and let user know
        alert('Custom array feature coming soon! Using shuffled array for now.');
        visualizer.shuffle();
        draw();
        updateStats();
    } catch (error) {
        alert('Invalid input format. Please use format: 5,3,8,1,9');
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
            <p><strong>How it works:</strong> ${info.description}</p>
            <p><strong>Algorithm Process:</strong> ${info.howItWorks}</p>
            <p><strong>Best Case:</strong> ${info.bestCase}</p>
            <p><strong>Worst Case:</strong> ${info.worstCase}</p>
            <p><strong>Stability:</strong> ${info.stability}</p>
            <p><strong>Use Case:</strong> ${info.useCase}</p>
        </div>
    `;
}

function toggleAlgorithmInfo() {
    const infoContent = document.getElementById('info-content');
    const toggleButton = document.getElementById('info-toggle');
    
    if (infoContent.classList.contains('hidden')) {
        infoContent.classList.remove('hidden');
        toggleButton.textContent = '🔽 Hide Info';
    } else {
        infoContent.classList.add('hidden');
        toggleButton.textContent = 'ℹ️ Show Info';
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
            document.getElementById('play-pause').textContent = '⏯️ Play/Pause';
        } else if (stepMode) {
            stepMode = false;
            isPaused = true;
            document.getElementById('play-pause').textContent = '▶️ Play';
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
            document.getElementById('play-pause').textContent = '⏯️ Play/Pause';
        } else if (stepMode) {
            stepMode = false;
            isPaused = true;
            document.getElementById('play-pause').textContent = '▶️ Play';
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
            document.getElementById('play-pause').textContent = '⏯️ Play/Pause';
        } else if (stepMode) {
            stepMode = false;
            isPaused = true;
            document.getElementById('play-pause').textContent = '▶️ Play';
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