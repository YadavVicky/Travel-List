import { useState } from "react";

export default function App(){
  const [items, setItems] = useState([]);

  let addItem = (item) => {
    setItems((items)=> [...items, item]);
  }

  let handleDelete = (id) => {
    setItems((items)=>items.filter((item)=>item.id !== id));
  }

  let handleChecked = (id) => {
    setItems((items)=>items.map((item)=> item.id === id ? { ...item, packed: !item.packed } : item ));
  }

  let handleClearList = () => {
    let confirmed = window.confirm("Are you sure ?");
    if(confirmed){
      setItems([]);
    }
  }

  return <div className="app">
    <Logo />
    <Form addItem={addItem}/>
    <PackingList items={items} deleteItem={handleDelete} checkItem={handleChecked} handleClearList={handleClearList} />
    <Stats items={items}/>
  </div>
}

function Logo(){
  return <h1>🌴 Far Away 🌅</h1>
}

function Form({ addItem }){
  const [desc, setDesc] = useState("");
  const [count, setCount] = useState(1);

  let handleSubmit = (e) => {
    e.preventDefault();
    if(!desc) return;
    const newItem = { description: desc, quantity: count, packed: false, id: Date.now()}
    addItem(newItem);
    setDesc("");
    setCount(1);
  }
  return <form className="add-form" onSubmit={handleSubmit}>
            <h3>What do you need for 😍 trip?</h3>
            <select value={count} onChange={(e)=>setCount(e.target.value)}>
              {Array.from({length: 10}, (_, i)=> i + 1)
                .map(num=>
                    <option key={num} value={num}>
                      {num}
                    </option>
                  )
              }
            </select>
            <input type="text" value={desc} placeholder="item..." onChange={(e)=>setDesc(e.target.value)}></input>
            <button>Add</button>
        </form>
}

function PackingList({ items, deleteItem, checkItem, handleClearList}){
  const [sortBy, setSortBy] = useState("input");
  
  let sortedItems;
  
  if(sortBy === 'input'){
    sortedItems =  items;
  }

  if(sortBy === 'description'){
    sortedItems =  items.slice().sort((a,b)=> a.description.localeCompare(b.description));
  }

  if(sortBy === 'packed'){
    sortedItems =  items.slice().sort((a,b)=>Number(a.packed)-Number(b.packed));
  }

  return <div className="list">
    <ul>
      {sortedItems.map(item=><Item  key={item.id} item={item} onDeleteItem={deleteItem} checkItem={checkItem} />)}
    </ul>
    <div className="action">
      <select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
        <option value='input'>Sort By Input Order</option>
        <option value='description'>Sort By Description</option>
        <option value='packed'>Sort By Packed Status</option>
      </select>
    <button onClick={handleClearList}>Clear List</button>
    </div>
  </div>
}

function Item({ item, onDeleteItem, checkItem }){
  return <li>
    <input type="checkbox" value={item.packed} onChange={()=>{checkItem(item.id)}}></input>
    <span style={item.packed ? {textDecoration: "line-through"} : {}}>
      {item.quantity} {item.description}
    </span>
    <button onClick={()=> { onDeleteItem(item.id) }}>❌</button>
  </li>
}

function Stats({ items }){
  const length = items.length;
  const packed = items.filter((item)=>item.packed).length;
  let percentage = Math.round((packed / length*100));
  if(!percentage) percentage = 0;
  return <footer className="stats">
    <em>
    { percentage === 100 ?
        'You got everything to go ✈️' 
        :
        `You have ${length} and ${packed} items on your list, and you already packed ${packed} (${percentage}%).`
    }
    </em>
  </footer>
}