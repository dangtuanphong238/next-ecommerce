import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { withSwal } from 'react-sweetalert2';

function Categories({ swal, _id, name: existingName }) {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState(existingName || '');
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    const [properties, setProperties] = useState([]);

    const _idNew = uuidv4();

    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories() {
        axios.get('/api/categories').then(res => {
            setCategories(res.data)
        });
    }

    async function saveCategory(ev) {
        ev.preventDefault();

        const data = {
            _id: _id || _idNew,
            name,
            parentCategory,
            properties: properties.map(p => ({
                name: p.name,
                values: p.values.split(',')
            }))
        }

        if (editedCategory) {
            //update
            data._id = editedCategory._id;
            await axios.put('/api/categories', data)
            setEditedCategory(null)
        } else {
            //create
            await axios.post('/api/categories', data);
        }
        setName('');
        setParentCategory('')
        setProperties([])
        fetchCategories()
    }

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category?.parent?._id);
        setProperties(
            category.properties.map(({ name, values }) => ({
                name,
                values: values.join(',')
            }))
        );
    }

    async function deleteCategory(category) {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonTitle: ' Cancel',
            confirmButtonText: 'Yes, Delete!',
            reverseButtons: true,
            confirmButtonColor: '#d55'
        }).then(async result => {
            // when confirmed and promise resolved...
            if (result.isConfirmed) {
                await axios.delete('/api/categories?_id=' + category._id)
                fetchCategories()
            }
        });
    }

    function addProperties() {
        setProperties(prev => {
            return [...prev, { name: '', values: '' }];
        })
    }

    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }

    function handlePropertyValueChange(index, property, newValue) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValue;
            return properties;
        });
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        })
    }

    return (
        <Layout>
            <h1>Categories</h1>
            <label>
                {editedCategory
                    ? `Edit category ${editedCategory.name}`
                    : 'Create new category'}
            </label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input
                        type="text"
                        placeholder="Categoty Name"
                        onChange={ev => setName(ev.target.value)}
                        value={name}
                    />
                    <select
                        value={parentCategory}
                        onChange={ev => setParentCategory(ev.target.value)}
                    >
                        <option value={'0'}>No parent category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button
                        onClick={addProperties}
                        type="button"
                        className="btn-default text-sm mb-2">
                        Add new property
                    </button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div className="flex gap-1 mb-2">
                            <input
                                type="text"
                                className="mb-0"
                                value={property.name}
                                onChange={(ev) => handlePropertyNameChange(index, property, ev.target.value)}
                                placeholder="property name (example: color)" />
                            <input
                                type="text"
                                className="mb-0"
                                value={property.values}
                                onChange={(ev) => handlePropertyValueChange(index, property, ev.target.value)}
                                placeholder="values, comma separated" />
                            <button
                                onClick={() => removeProperty(index)}
                                className="btn-red"
                                type="button">
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    {editedCategory && (
                        <button
                            onClick={() => {
                                setEditedCategory(null)
                                setName('')
                                setParentCategory('')
                                setProperties([])
                            }}
                            type="button"
                            className="btn-default">
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="btn-primary py-1">
                        Save
                    </button>
                </div>
            </form>
            {!editedCategory && (
                <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td>Category name</td>
                            <td>Parent category</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 && categories.map(category => (
                            <tr>
                                <td>{category?.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td>
                                    <button
                                        onClick={() => editCategory(category)}
                                        className="btn-primary mr-1">
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteCategory(category)}
                                        className="btn-red">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </Layout>
    )
}

export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />
))