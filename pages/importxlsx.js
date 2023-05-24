import { map } from "@/components/template";
import readXlsxFile from "read-excel-file";
import Layout from "@/components/Layout";
import { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { withSwal } from 'react-sweetalert2';

function ImportXlsx({ swal }) {
    const [values, setValues] = useState([])

    async function saveProduct() {
        const categories = await axios.get('/api/categories').then(result => {
            return result.data
        })

        console.log({ values })
        const tempArray = values.map(e => {
            const _idNew = uuidv4();
            return {
                _id: _idNew,
                title: e.Product,
                description: e.Description,
                price: e.Price,
                images: e.Images,
                category: e.Category,
                properties: {}
            }
        })
        console.log(tempArray, categories)

        let result = [];

        if (tempArray.length > 0) {
            tempArray.map(e => {
                const category = categories.find((cat) => cat.name == e.category)
                if (category) {
                    const mappedObject = { ...e, category: category._id }
                    result.push(mappedObject)
                }
            })
        }

        // for (let j = 0; j < tempArray.length; j++) {
        //     const itemB = tempArray[j];
        //     const numB = itemB.category;

        //     const category = categories.find((cat) => cat.name == numB)

        //     if (category) {
        //         const mappedObject = { ...itemB, category: category._id }
        //         result.push(mappedObject)
        //     }
        // }

        // for (let j = 0; j < tempArray.length; j++) {
        //     const itemB = tempArray[j];
        //     const numB = itemB.category;
        //     for (let i = 0; i < categories.length; i++) {
        //         const itemA = categories[i];
        //         const numA = itemA.name;
        //         if (numA === numB) {
        //             const mappedObject = { ...itemB, category: itemA._id }
        //             result.push(mappedObject)
        //             break;
        //         }
        //     }
        // }

        if (result.length == tempArray.length) {
            await axios.post('/api/list_product', result).then(res => {
                if (res.status == 200) {
                    swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Save successful',
                        showConfirmButton: false,
                        timer: 3000
                    })
                }
                else {
                    swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Save failed',
                        showConfirmButton: false,
                        timer: 3000,
                    })
                }
            })
        }
        else {
            swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Save failed',
                showConfirmButton: false,
                timer: 3000,
            })
        }
    }

    function ImportFile(resultRows) {
        if (resultRows.length > 0) {
            const imageArray = resultRows.map(e => {
                const images = e.Image.split("###").map((image, index) => {
                    const _idNew = uuidv4();
                    return {
                        _id: _idNew,
                        url: image
                    }
                });
                return { ...e, Images: images }
            })
            setValues(imageArray)
        }
        // this.handleSubmit("api/UpdatePnreceivableCompute/Update", resultRows)
    }

    function onChangeInput(e) {
        const file = e.target.files[0];
        if (file) {
            readXlsxFile(file, { schema: map }).then(({ rows, errors }) => {
                ImportFile(rows);
            }, function (error) {
                alert("File vừa chọn lỗi. Vui lòng chọn file khác.")
            });
        }
        e.target.value = null;
    }
    return (
        <Layout>
            <input type={'file'} id="buttonImportFile" onChange={onChangeInput} hidden />
            <button className="btn-default" onClick={() => {
                const input = document.getElementById('buttonImportFile');
                input && input.click();
            }}>
                Thêm file
            </button>

            <table className="basic mt-2">
                <thead>
                    <tr>
                        <td style={{ width: '20%' }}>Sản phẩm</td>
                        <td style={{ width: '20%' }}>Danh mục</td>
                        <td style={{ width: '20%' }}>Ảnh</td>
                        <td style={{ width: '20%' }}>Mô tả</td>
                        <td style={{ width: '20%' }}>Giá</td>
                    </tr>
                </thead>
                {values.length > 0 &&
                    <tbody>
                        {values.map(field => (
                            <tr key={field.Product}>
                                <td>{field.Product}</td>
                                <td>{field.Category}</td>
                                <td>
                                    <div className="flex flex-grow flex-wrap">
                                        {field.Images.length > 0 &&
                                            field.Images.map(image => (
                                                <img
                                                    className="w-24 h-24 px-1"
                                                    key={image._id}
                                                    src={image.url}
                                                    alt=""
                                                />
                                            ))
                                        }
                                    </div>

                                </td>
                                <td>{field.Description}</td>
                                <td>{field.Price}</td>
                            </tr>
                        ))}
                    </tbody>
                }

            </table>

            {values.length > 0 &&
                <div className="bottom-button">
                    <button className="btn-primary end" onClick={saveProduct}>
                        Save
                    </button>
                </div>
            }
        </Layout>
    )
}

export default withSwal(({ swal }, ref) => (
    <ImportXlsx swal={swal} />
))