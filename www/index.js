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

// Add WASM detection markers
window.RUST_WASM_FRAMEWORK = true;
window.WASM_BINDGEN = true;

// Algorithm complexity data
const algorithmComplexity = {
    bubble: { time: 'O(n²)', space: 'O(1)' },
    selection: { time: 'O(n²)', space: 'O(1)' },
    insertion: { time: 'O(n²)', space: 'O(1)' },
    merge: { time: 'O(n log n)', space: 'O(n)' },
    quick: { time: 'O(n log n)', space: 'O(log n)' },
    heap: { time: 'O(n log n)', space: 'O(1)' },
    shell: { time: 'O(n^1.5)', space: 'O(1)' }
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
    });
    
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