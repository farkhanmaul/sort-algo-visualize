# Sorting Algorithm Visualizer

A web-based sorting algorithm visualizer built with Rust and WebAssembly, deployed on GitHub Pages.

## Features

- Interactive visualization of popular sorting algorithms
- Bubble Sort with step-by-step animation
- Quick Sort and Merge Sort with instant visualization
- Adjustable array size (10-100 elements)
- Responsive design with modern UI

## Algorithms Implemented

- **Bubble Sort**: Animated step-by-step visualization
- **Quick Sort**: Instant sort with divide-and-conquer approach
- **Merge Sort**: Instant sort with merge-based approach

## Development

### Prerequisites

- Rust (latest stable)
- wasm-pack
- A web server for local development

### Building

```bash
# Build the WASM module
wasm-pack build --target web --out-dir www/pkg

# Serve the web files
cd www
python -m http.server 8000
# or use any other static file server
```

### Project Structure

```
├── src/
│   ├── lib.rs              # Main WASM interface
│   ├── utils.rs            # Utility functions
│   └── sorting/            # Sorting algorithms
│       ├── mod.rs
│       ├── bubble_sort.rs
│       ├── quick_sort.rs
│       └── merge_sort.rs
├── www/
│   ├── index.html          # Main HTML page
│   ├── style.css           # Styling
│   ├── index.js            # JavaScript interface
│   └── pkg/                # Generated WASM files
├── .github/workflows/      # GitHub Actions
└── Cargo.toml              # Rust dependencies
```

## Deployment

The project is automatically deployed to GitHub Pages via GitHub Actions when code is pushed to the main branch.

## Technologies Used

- **Rust**: Core logic and sorting algorithms
- **WebAssembly (WASM)**: Bridge between Rust and JavaScript
- **JavaScript**: Web interface and canvas rendering
- **HTML5 Canvas**: Visualization rendering
- **CSS3**: Modern styling and animations
- **GitHub Actions**: CI/CD pipeline
- **GitHub Pages**: Hosting platform