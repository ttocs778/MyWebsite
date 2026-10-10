---
title: Custom allocators
tags:
  - cpp
  - memory
updated: '2026-09-16T00:27:11.053Z'
source: Custom allocators
---

`new`/`delete` are general-purpose and slow-ish. If you know your allocation pattern ahead of time, a custom allocator can be much faster.

## Stack allocator
Allocations and frees happen in strict reverse order — like a call stack. Freeing is just moving a pointer backward — no bookkeeping needed. Perfect for temporary, scoped allocations (per-frame data in a game loop) where the last thing allocated is always the first thing freed.

## Pool allocator
Pre-carve memory into equal-sized chunks up front. Freed chunks go onto a free list; allocating just pops one off that list.
```
[chunk][chunk][chunk][chunk] -> free list links the unused ones together
```
No fragmentation (every chunk is the same size), and allocation/deallocation are both O(1). Ideal when constantly creating and destroying lots of same-sized objects (particles, enemies, scene nodes).

## Boundary Tag Allocator

A **Boundary Tag Allocator** is a memory management technique used in **dynamic memory allocation** to efficiently manage **free and allocated blocks** of memory in a **contiguous memory pool** (like a heap).

**Key Concept:**

Each memory block has a **header** and (sometimes) a **footer**, which store:

- The **size** of the block
- Whether the block is **free or allocated**

```cpp
[ Header | Payload (usable memory) | Footer (optional) ]
/*
Header: Contains size and allocation status.
Payload: The actual memory returned to the user.
Footer: (optional) Mirrors the header; used to find the previous block.
*/
```

These "tags" (in header/footer) make it easy to:

- Traverse memory
- **Merge adjacent free blocks** (coalescing) when freeing memory
- Avoid external fragmentation

_Code Example:_

```cpp
#include <iostream>

using namespace std;

// Structure for memory block (includes boundary tags)
struct Block {
    size_t size;    // Size of block (excluding header/footer)
    bool isFree;    // Is this block free?
    Block* next;    // Pointer to next block
    Block* prev;    // Pointer to previous block
};

/*
Each memory block has:
	Size (size) of the usable memory.
	Status (isFree) → true means free, false means allocated.
	Pointers (next and prev) → Linked list for easy navigation.
*/

// Global memory pool (simulating heap memory)
const size_t MEMORY_SIZE = 1024;  // 1KB heap space
char memory[MEMORY_SIZE];         // Simulated memory array

// Initialize the memory pool
Block* freeList = (Block*)memory;

void initializeMemory() {
    freeList->size = MEMORY_SIZE - sizeof(Block); // Whole space as free
    freeList->isFree = true;
    freeList->next = nullptr;
    freeList->prev = nullptr;
}

/*
Creates a single large free block (freeList) at the beginning.
Excludes the header/footer size from usable space.
*/

// Allocate memory using the first-fit strategy
void* allocate(size_t size) {
    Block* current = freeList;

    while (current) {
        if (current->isFree && current->size >= size) { // Found a suitable block
            size_t remainingSize = current->size - size - sizeof(Block);
            
            if (remainingSize > sizeof(Block)) { // Split block if space remains
                Block* newBlock = (Block*)((char*)current + sizeof(Block) + size);
                newBlock->size = remainingSize;
                newBlock->isFree = true;
                newBlock->next = current->next;
                newBlock->prev = current;

                current->size = size;
                current->next = newBlock;
            }

            current->isFree = false; // Mark block as used
            return (char*)current + sizeof(Block); // Return pointer to usable memory
        }
        current = current->next;
    }
    return nullptr; // No suitable block found
}

/*
Finds the first free block that fits the requested size.
	Splits the block if there’s extra space.
	Marks it as allocated.
	Returns a pointer to usable memory.
*/

// Merge adjacent free blocks
void coalesce(Block* block) {
    if (block->next && block->next->isFree) {
        block->size += block->next->size + sizeof(Block);
        block->next = block->next->next;
        if (block->next) {
            block->next->prev = block;
        }
    }
    if (block->prev && block->prev->isFree) {
        coalesce(block->prev);
    }
}
/*
Checks next block: If free, merges with it.
Checks previous block: If free, merges backward.
*/

// Free memory block and merge if possible
void deallocate(void* ptr) {
    if (!ptr) return;

    Block* block = (Block*)((char*)ptr - sizeof(Block)); // Get the block from memory pointer
    block->isFree = true;
    coalesce(block); // Try merging adjacent free blocks
}
/*
Marks the block as free.
Calls coalesce(block); to merge adjacent free blocks.
*/

// Print memory layout (for debugging)
void printMemory() {
    Block* current = (Block*)memory;
    cout << "Memory Layout:\n";
    while ((char*)current < memory + MEMORY_SIZE) {
        cout << "[Size: " << current->size << ", " 
             << (current->isFree ? "Free" : "Allocated") << "] ";
        current = (Block*)((char*)current + current->size + sizeof(Block));
    }
    cout << "\n";
}

// Main function to test the allocator
int main() {
    initializeMemory();
    printMemory();

    void* p1 = allocate(100);
    void* p2 = allocate(200);
    printMemory();

    deallocate(p1);
    printMemory();

    deallocate(p2);
    printMemory();

    return 0;
}

```
## When to actually bother
Only after profiling shows `new`/`delete` is a real bottleneck. Both trade flexibility for speed — a stack allocator can't free out of order, a pool allocator can't hand out different sizes.

## Related
[new and delete](/notes/new-and-delete)
