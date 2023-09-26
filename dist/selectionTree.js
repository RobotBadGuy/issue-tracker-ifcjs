// Get the tree view element
const treeView = document.getElementById('ifc-tree-view');

// Sample data representing the hierarchical structure
const data = [
  {
    id: 1,
    label: 'Parent Node 1',
    children: [
      { id: 2, label: 'Child Node 1' },
      { id: 3, label: 'Child Node 2' }
    ]
  },
  {
    id: 4,
    label: 'Parent Node 2',
    children: [
      {
        id: 5,
        label: 'Child Node 3',
        children: [
          { id: 6, label: 'Grandchild Node 1' },
          { id: 7, label: 'Grandchild Node 2' }
        ]
      }
    ]
  }
];

// Render the tree view
function renderTreeView(items, parentElement) {
  // Create a container for the current level of items
  const container = document.createElement('ul');

  // Loop through each item
  items.forEach(item => {
    // Create a list item for the item
    const listItem = document.createElement('li');
    listItem.className = 'ifc-tree-node';
    listItem.textContent = item.label;

    // Add click event listener to the list item
    listItem.addEventListener('click', () => {
      selectNode(item);
    });

    // Append the list item to the container
    container.appendChild(listItem);

    // Recursively render child nodes if present
    if (item.children) {
      const childContainer = renderTreeView(item.children, listItem);
      listItem.appendChild(childContainer);
    }
  });

  // Append the container to the parent element
  parentElement.appendChild(container);

  return container;
}

// Function to handle node selection
function selectNode(node) {
  // Clear previously selected nodes
  const selectedNodes = document.querySelectorAll('.ifc-tree-node.selected');
  selectedNodes.forEach(node => {
    node.classList.remove('selected');
  });

  // Add 'selected' class to the selected node
  const selectedNode = document.querySelector(`[data-id="${node.id}"]`);
  selectedNode.classList.add('selected');

  // Perform additional actions for the selected node
  console.log(`Selected Node: ${node.label}`);
}

// Initialize the tree view
renderTreeView(data, treeView);
