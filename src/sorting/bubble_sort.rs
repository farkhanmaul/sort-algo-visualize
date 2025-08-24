pub fn bubble_sort_step(arr: &mut Vec<i32>) -> bool {
    let mut swapped = false;
    let len = arr.len();
    
    for i in 0..len - 1 {
        if arr[i] > arr[i + 1] {
            arr.swap(i, i + 1);
            swapped = true;
        }
    }
    
    !swapped
}