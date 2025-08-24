pub fn merge_sort(arr: &mut Vec<i32>) {
    let len = arr.len();
    if len <= 1 {
        return;
    }
    
    merge_sort_helper(arr, 0, len - 1);
}

fn merge_sort_helper(arr: &mut Vec<i32>, left: usize, right: usize) {
    if left < right {
        let mid = left + (right - left) / 2;
        
        merge_sort_helper(arr, left, mid);
        merge_sort_helper(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

fn merge(arr: &mut Vec<i32>, left: usize, mid: usize, right: usize) {
    let left_len = mid - left + 1;
    let right_len = right - mid;
    
    let left_arr: Vec<i32> = arr[left..=mid].to_vec();
    let right_arr: Vec<i32> = arr[mid + 1..=right].to_vec();
    
    let mut i = 0;
    let mut j = 0;
    let mut k = left;
    
    while i < left_len && j < right_len {
        if left_arr[i] <= right_arr[j] {
            arr[k] = left_arr[i];
            i += 1;
        } else {
            arr[k] = right_arr[j];
            j += 1;
        }
        k += 1;
    }
    
    while i < left_len {
        arr[k] = left_arr[i];
        i += 1;
        k += 1;
    }
    
    while j < right_len {
        arr[k] = right_arr[j];
        j += 1;
        k += 1;
    }
}