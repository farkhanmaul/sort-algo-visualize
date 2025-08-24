// Built with Rust and WebAssembly
// Framework: Rust + wasm-bindgen + wasm-pack
import init, { SortingVisualizer } from './pkg/sorting_visualizer.js';

let visualizer;
let canvas;
let ctx;
let animationId;
let isAnimating = false;

// Add WASM detection markers
window.RUST_WASM_FRAMEWORK = true;
window.WASM_BINDGEN = true;

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
    document.getElementById('shuffle').addEventListener('click', () => {
        if (!isAnimating) {
            visualizer.shuffle();
            draw();
        }
    });
    
    document.getElementById('bubble-sort').addEventListener('click', () => {
        if (!isAnimating) {
            animateBubbleSort();
        }
    });
    
    document.getElementById('quick-sort').addEventListener('click', () => {
        if (!isAnimating) {
            visualizer.quick_sort();
            draw();
        }
    });
    
    document.getElementById('merge-sort').addEventListener('click', () => {
        if (!isAnimating) {
            visualizer.merge_sort();
            draw();
        }
    });
    
    sizeSlider.addEventListener('input', (e) => {
        if (!isAnimating) {
            const newSize = parseInt(e.target.value);
            sizeValue.textContent = newSize;
            visualizer = new SortingVisualizer(newSize);
            visualizer.shuffle();
            draw();
        }
    });
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
        const isDone = visualizer.bubble_sort_step();
        draw();
        
        if (isDone) {
            isAnimating = false;
            setButtonsDisabled(false);
        } else {
            setTimeout(step, 50); // Delay between steps
        }
    }
    
    step();
}

function setButtonsDisabled(disabled) {
    const buttons = document.querySelectorAll('button');
    const slider = document.getElementById('array-size');
    
    buttons.forEach(button => button.disabled = disabled);
    slider.disabled = disabled;
}

run();