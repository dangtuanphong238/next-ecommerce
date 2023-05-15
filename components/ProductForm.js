import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { ReactSortable } from 'react-sortablejs'

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImage,
  category: assignedCategory,
  properties: assignedProperties
}) {
  const [title, setTitle] = useState(existingTitle || '')
  const [description, setDescription] = useState(existingDescription || '')
  const [price, setPrice] = useState(existingPrice || '')
  const [goToProducts, setGoToProducts] = useState(false)
  const [images, setImages] = useState(existingImage || [])
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState(assignedCategory || '');
  const [productProperties, setProductProperties] = useState(assignedProperties || {});

  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data)
    })
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    const _idNew = uuidv4();

    const data = {
      _id: _id || _idNew, title, description, price, images: images, category, properties: productProperties
    }
    console.log({ data })
    if (_id) {
      //update
      await axios.put('/api/products', { ...data, _id })
    } else {
      //create
      await axios.post('/api/products', data)
    }
    setGoToProducts(true)
  }

  if (goToProducts) {
    router.push('/products')
  }

  async function uploadImages(ev) {
    const file = ev.target?.files[0]
    const _idImageNew = uuidv4();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'h47tbvog');

    const data = await fetch(`https://api.cloudinary.com/v1_1/dhtmahqsw/image/upload`, {
      method: 'POST',
      body: formData
    }).then(r => r.json());
    console.log("data", data)
    if (data) {
      const url = data.url;
      setImages(oldImages => {
        return [...oldImages, {
          _id: _idImageNew,
          url: url
        }]
      })
    }

    //save file to disk and generate an url:
    // if (file) {
    //   const reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onload = () => {
    //     const data = reader.result.split(',')[1];
    //     const name = file.name;
    //     fetch('/api/upload', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ name, data }),
    //     })
    //       .then((res) => res.json())
    //       .then((data) => {
    //         setImages(oldImages => {
    //           return [...oldImages, { 
    //             _id: _idImageNew, 
    //             url: `http://localhost:3000/${data}` }]
    //           })
    //       })
    //       .catch((err) => console.log(err));
    //   };
    // }
  }

  function updateImagesOrder(images) {
    setImages(images)
  }

  function setProductProp(propName, value) {
    setProductProperties(prev => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    })
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    console.log({ catInfo })
    if (catInfo?.properties) {
      propertiesToFill.push(...catInfo.properties);
    }
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id);
      propertiesToFill.push(...parentCat.properties)
      catInfo = parentCat;
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={ev => setTitle(ev.target.value)}
      />
      <label>Category</label>
      <select
        value={category}
        onChange={ev => setCategory(ev.target.value)}
      >
        <option value={'0'}>Uncategorized</option>
        {categories.length > 0 && categories.map(category => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      {propertiesToFill.length > 0 && propertiesToFill.map(p => (
        <div className="" key={p._id}>
          <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
          <div>
            <select
              value={productProperties[p.name]}
              onChange={(ev) => {
                setProductProp(p.name, ev.target.value)
              }}>
              {p.values.map((v, index) => (
                <option key={index} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
      <label>
        Photos
      </label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          className="flex flex-wrap gap-1"
          list={images}
          setList={updateImagesOrder}>
          {!!images.length && (images.map(e => {
            if (!!e.url) {
              return (
                <div key={e._id} className="h-24 w-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                  <img src={e.url} alt="" className="rounded-lg" />
                </div>
              )
            }
          })
          )}
        </ReactSortable>
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center
         justify-center text-sm gap-1 text-gray-500 rounded-lg bg-white shadow-md 
         border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div>
            Upload
          </div>
          <input type="file" className="hidden" onChange={uploadImages} />
        </label>
      </div>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={ev => setDescription(ev.target.value)}
      />
      <label>Price (in USD)</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={ev => setPrice(ev.target.value)}
      />
      <button
        type="submit"
        className="btn-primary">
        Save
      </button>
    </form>
  )
}
