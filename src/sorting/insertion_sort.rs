pub fn insertion_sort(arr: &mut Vec<i32>) {
    let len = arr.len();
    
    for i in 1..len {
        let key = arr[i];
        let mut j = i as i32 - 1;
        
        while j >= 0 && arr[j as usize] > key {
            arr[(j + 1) as usize] = arr[j as usize];
            j -= 1;
        }
        arr[(j + 1) as usize] = key;
    }
}

pub fn insertion_sort_step(arr: &mut Vec<i32>, step: &mut usize) -> bool {
    let len = arr.len();
    
    if *step >= len {
        return true; // Sorting complete
    }
    
    if *step == 0 {
        *step = 1;
        return false;
    }
    
    let key = arr[*step];
    let mut j = *step as i32 - 1;
    
    while j >= 0 && arr[j as usize] > key {
        arr[(j + 1) as usize] = arr[j as usize];
        j -= 1;
    }
    arr[(j + 1) as usize] = key;
    
    *step += 1;
    *step >= len
}