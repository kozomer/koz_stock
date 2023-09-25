import React, { useState, useEffect } from 'react';
import { Card, Form,FormGroup,CardFooter, CardTitle,CardHeader,CardBody,Dropdown, DropdownToggle, DropdownMenu, DropdownItem,DropdownContext , Input, Button, Table } from 'reactstrap';
import localforage from 'localforage';
import Select from 'react-select';
import ReactTable from 'components/ReactTable/ReactTable.js';
import '../../assets/css/Table.css';
import ReactBSAlert from "react-bootstrap-sweetalert";
import { total } from 'react-big-calendar/lib/utils/dates';


function QTOForm() {
    const [file, setFile] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [elevations, setElevations] = useState([]);
    const [sections, setSections] = useState([]);
    const [places, setPlaces] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [selectedElevation, setSelectedElevation] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dataChanged, setDataChanged] = useState(false);
    const [renderEdit, setRenderEdit] = useState(false);
    const [productData, setProductData] = useState(null);
    const [showUploadDiv, setShowUploadDiv] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);

    
    const [deleteData, setDeleteData] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    // Additional fields for QuantityTakeOff
    const [id, setId] = useState('');
    const [poseCode, setPoseCode] = useState('');
    const [poseNumber, setPoseNumber] = useState('');
    const [manufacturingCode, setManufacturingCode] = useState('');
    const [material, setMaterial] = useState('');
    const [description, setDescription] = useState('');
    const [width, setWidth] = useState('');
    const [depth, setDepth] = useState('');
    const [height, setHeight] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [multiplier, setMultiplier] = useState('');
    const [multiplier2, setMultiplier2] = useState('');
    const [takeOut, setTakeOut] = useState('');
    const [total, setTotal] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [rows, setRows] = useState([]);

    const [editingRowId, setEditingRowId] = useState(null); // A new state

    
    
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        fetchBuildings();
    }, []);

    
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const fetchBuildings = async () => {
        try {
            const access_token = await localforage.getItem('access_token'); 
      
            const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/buildings_for_project/`,{
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ String(access_token)
              }});

                          const data = await response.json();
                          console.log("Fetched data1:", data);
            setBuildings(data);
        } catch (error) {
            console.error("Error fetching buildings:", error);
        }
    };

    const handleBuildingChange = async (buildingId) => {
        setSelectedBuilding(buildingId);
        console.log("buildingId:", buildingId);
        console.log('Starting handleBuildingChange');
        const access_token = await localforage.getItem('access_token'); 
    
        try {
            const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/floors_for_building/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(access_token)
                },
                body: JSON.stringify({
                    building_id: buildingId
                })
            });
            
            const data = await response.json();
            console.log("Fetched data2:", data);
            setElevations(data);
        } catch (error) {
            console.error("Error fetching elevations:", error);
        }
        console.log('Starting handleBuildingChange');
    };
    

    const handleElevationChange = async (elevationId) => {
        setSelectedElevation(elevationId);
        const access_token = await localforage.getItem('access_token'); 
        console.log("elevationId:", elevationId);
        console.log('Starting handleElevationChange');
        try {
            const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/sections_for_floor/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(access_token)
                },
                body: JSON.stringify({
                    elevation_id: elevationId
                })
            });
            const data = await response.json();
            console.log("Fetched data3:", data);
            setSections(data);
        } catch (error) {
            console.error("Error fetching sections:", error);
        }
        console.log('Ending handleElevationChange');
    };

    const handleSectionChange = async (sectionId) => {
        setSelectedSection(sectionId);
        console.log("sectionId:", sectionId);
        console.log('Starting  handleSectionChange');
        const access_token = await localforage.getItem('access_token'); 

        try {
            const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/places_for_section/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(access_token)
                },
                body: JSON.stringify({
                    section_id: sectionId
                })
            });
            const data = await response.json();
            console.log("Fetched data4:", data);
            setPlaces(data);
        } catch (error) {
            console.error("Error fetching places:", error);
        }
        console.log('Ending  handleSectionChange');
    };



    const fetchElevations = async (buildingId) => {
        setSelectedBuilding(buildingId);
      
               const access_token = await localforage.getItem('access_token'); 
    
        try {
            const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/floors_for_building/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(access_token)
                },
                body: JSON.stringify({
                    building_id: buildingId
                })
            });
            
            const data = await response.json();
            console.log(data);
            setElevations(data);
        } catch (error) {
            console.error("Error fetching elevations:", error);
        }
    };
    // When 'selectedBuilding' changes, reset related states
useEffect(() => {
    console.log("sadsa")
    if (selectedBuilding) {
        setSelectedElevation(null);
        setSelectedSection(null);
        setSelectedPlace(null);
    }
}, [selectedBuilding]);

// When 'selectedElevation' changes, reset related states
useEffect(() => {
    if (selectedElevation) {
        setSelectedSection(null);
        setSelectedPlace(null);
    }
}, [selectedElevation]);

// When 'selectedSection' changes, reset 'selectedPlace'
useEffect(() => {
    if (selectedSection) {
        setSelectedPlace(null);
    }
}, [selectedSection]);


    const handleSubmit = async () => {
        const access_token = await localforage.getItem('access_token'); 
        console.log(selectedSection)
        try {
            const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/add_qto/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(access_token)
                },
                body: JSON.stringify({
                    building_id: selectedBuilding,
                    elevation_or_floor_id: selectedElevation,
                    section_id: selectedSection,
                    place_id: selectedPlace,
                    pose_code: poseCode,
                    manufacturing_code: manufacturingCode,
                    material: material,
                    description: description,
                    width: width,
                    depth: depth,
                    height: height,
                    quantity: quantity,
                    unit: unit,
                    multiplier: multiplier,
                    multiplier2: multiplier2,
                    take_out: takeOut
                })
            });
            const data = await response.json();
            if (response.status === 201) {
                successUpload(data.message);
                setIsAdding(false); 
                setDataChanged(true);

                
                setSelectedBuilding(null);  // or whatever default value you want
                setSelectedElevation(null);
                setSelectedSection(null);
                setSelectedPlace(null);
                setPoseCode('');
                setManufacturingCode('');
                setMaterial('');
                setDescription('');
                setWidth('');
                setDepth('');
                setHeight('');
                setQuantity('');
                setUnit('');
                setMultiplier('');
                setMultiplier2('');
                setTakeOut('');
                

            } else {
                errorUpload(data.error);
            }
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    const buildingOptions = buildings.map(b => ({ value: b.id, label: b.name }));
    const elevationOptions = elevations.map(e => ({ value: e.id, label: e.name }));
    const sectionOptions = sections.map(s => ({ value: s.id, label: s.name }));
    const placeOptions = places.map(p => ({ value: p.id, label: p.name }));


    console.log("selectedSection:", selectedSection);
    console.log("Matching Option:", sectionOptions.find(option => option.value ===  selectedSection));
     console.log("Section Options:",sectionOptions)

    useEffect(() => {
        fetchBuildings();
       
    }, []);

    const handleCancel = () => {
        setShowPopup(false);
        setShowEditPopup(false);
        setSelectedBuilding(null);  // or whatever default value you want
        setSelectedElevation(null);
        setSelectedSection(null);
        setSelectedPlace(null);
        setPoseCode('');
        setManufacturingCode('');
        setMaterial('');
        setDescription('');
        setWidth('');
        setDepth('');
        setHeight('');
        setQuantity('');
        setUnit('');
        setMultiplier('');
        setMultiplier2('');
        setTakeOut('');
        
      };
  
    
      useEffect(() => {
        async function fetchRows () {
        const access_token = await localforage.getItem('access_token'); 
        try {
            const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/qto/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(access_token)
                }
            });

            const data = await response.json();
            console.log("data table:",data)
            setDataTable(data);
            setDataChanged(false);
        } catch (error) {
            console.error("Error fetching rows:", error);
        }
    };
    fetchRows();
}, [dataChanged,renderEdit]);
    const customStyles = {
        menu: (provided, state) => ({
          ...provided,
          maxHeight: '150px',
          overflowY: 'auto'
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 }),
      };


      

    const successUpload = (s) => {
        setAlert(
          <ReactBSAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Uploaded!"
            onConfirm={() => { hideAlert()
            setShowPopup(false)}}
            onCancel={() => hideAlert()}
            confirmBtnBsStyle="info"
            btnSize=""
          >
            {s}
          </ReactBSAlert>
        );
      };

      const errorUpload = (e) => {
        setAlert(
          <ReactBSAlert
            danger
            style={{ display: "block", marginTop: "-100px" }}
            title="Error"
            onConfirm={() => hideAlert()}
            onCancel={() => hideAlert()}
            confirmBtnBsStyle="info"
            btnSize=""
          >
           {e}
          </ReactBSAlert>
        );
      };

      const hideAlert = () => {
        setAlert(null);
      };
      const warningWithConfirmAndCancelMessage = () => {

        setAlert(
    
          <ReactBSAlert
            warning
            style={{ display: "block", marginTop: "-100px" }}
            title="Are you sure?"
            onConfirm={() => {
              setDeleteConfirm(true);
              successDelete()
            }}
            onCancel={() => {
              setDeleteConfirm(false);
              cancelDelete()
            }}
            confirmBtnBsStyle="info"
            cancelBtnBsStyle="danger"
            confirmBtnText="Yes, delete it!"
            cancelBtnText="Cancel"
            showCancel
            btnSize=""
          >
            Are you sure to delete this row?
          </ReactBSAlert>
        );
    
      };


      useEffect(() => {
        async function deleteFunc() {
          if (deleteConfirm) {
            const access_token = await localforage.getItem('access_token');
            console.log(deleteData)
            
            try {
              const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/delete_qto/`, {
                method: "POST",
                body: JSON.stringify(deleteData),
                headers: {
                  'Authorization': 'Bearer ' + String(access_token),
                  'Content-Type': 'application/json',
                }
              });
    
              const responseData = await response.json();  // Parse the response data
    
              if (!response.ok) {
                errorUpload(responseData.error);
              } else {
                successUpload(responseData.message);
              }
            } catch (e) {
              // If the fetch itself fails, for example due to network errors
              errorUpload(e.toString());
            }
    
            setDataChanged(!dataChanged);
            setDeleteConfirm(false);
          }
        }
    
        deleteFunc();
      }, [deleteConfirm]);
     
    

    const successDelete = () => {
        setAlert(
          <ReactBSAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Deleted!"
            onConfirm={() => hideAlert()}
            onCancel={() => hideAlert()}
            confirmBtnBsStyle="info"
            btnSize=""
          >
            Your row has been deleted.
          </ReactBSAlert>
        );
      };
      const cancelDelete = () => {
        setAlert(
          <ReactBSAlert
            danger
            style={{ display: "block", marginTop: "-100px" }}
            title="Cancelled"
            onConfirm={() => hideAlert()}
            onCancel={() => hideAlert()}
            confirmBtnBsStyle="info"
            btnSize=""
          >
            Your row is safe :)
          </ReactBSAlert>
        );
      };

      useEffect(() => {
        if (productData) {// Ensure all 19 fields are present

            console.log("product data:",productData)
            setId(productData[0]);
            // For the building_name, elevation_or_floor_name, etc., you'll have to find the corresponding ids 
            // from your options list. Assuming you have something like
            const buildingId=productData[1].id
            handleBuildingChange(buildingId).then(() => {
                const elevationId = productData[2].id
                setSelectedElevation(elevationId);
    
                handleElevationChange(elevationId).then(() => {
                    const sectionId = productData[3].id
                    setSelectedSection(sectionId);
                    
    
                    handleSectionChange(sectionId).then(() => {
                        const placeId = productData[4].id
                        setSelectedPlace(placeId);
                    });
                });
            })
           
            
            setPoseCode(productData[5]);
            setPoseNumber(productData[6]);
            setManufacturingCode(productData[7]);
            setMaterial(productData[8]);
            setDescription(productData[9]);
            setWidth(productData[10]);
            setDepth(productData[11]);
            setHeight(productData[12]);
            setQuantity(productData[13]);
            setUnit(productData[14]);
            setMultiplier(productData[15]);
            setMultiplier2(productData[16]);
            setTakeOut(productData[17]);
            setTotal(productData[18]);
        }
    }, [productData]);
      
      const handleClick = (row) => {
        setProductData(row);
        setShowEditPopup(true);
      };

  
    

      const handleEdit = async (event) => {
        event.preventDefault();
    
        console.log(selectedBuilding)
    
        const access_token = await localforage.getItem('access_token');
        const updatedData = {
          old_id: id,
          building_id: selectedBuilding,
          elevation_or_floor_id: selectedElevation,
          section_id: selectedSection,
          place_id: selectedPlace,
          pose_code:poseCode,
          pose_number:poseNumber,
          manufacturing_code: manufacturingCode,
          material:material,
          description:description,
          width:width,
          depth:depth,
          heigth:height,
          quantity:quantity,
          unit:unit,
          multiplier:multiplier,
          multiplier2:multiplier2,
          take_out:takeOut,
          total:total,
        };
    
        fetch(`${process.env.REACT_APP_PUBLIC_URL}/edit_qto/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + String(access_token)
          },
          body: JSON.stringify(updatedData)
        })
          .then(response => response.json().then(data => ({ status: response.status, body: data })))
          .then(({ status, body }) => {
            if (status === 200) { // Assuming 200 is the success status code
              console.log("Inflow edited successfully");
              successUpload(body.message);
            
    
              setDataChanged(true);
              setShowEditPopup(false);
    
    
            } else {
              console.log("Failed to edit inflow", body.error);
              errorUpload(body.error);
            }
          })
          .catch(error => {
            console.error('Error:', error);
            errorUpload(error.message);
          });
      };
    

      const handleAddFileClick = () => {
        clearTimeout(timeoutId); // Clear any existing timeout
        setTimeoutId(setTimeout(() => setShowUploadDiv(true), 500));
       
        
      }
      
      const handleUploadClick = async () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        const access_token = await localforage.getItem('access_token');
        fetch(`${process.env.REACT_APP_PUBLIC_URL}/add_excel_qto/`, {
          method: 'POST',
          body: formData,
          
          headers: {
              
            'Authorization': 'Bearer '+ String(access_token)
          },
        })
        .then((response) => {
          if (!response.ok) {
            return response.json().then(data => {
              console.log(data.error)
              setIsLoading(false);
              errorUpload(data.error);
            });
          }
         
          else{
            return response.json().then(data => {
          setIsLoading(false);
          successUpload(data.message);
          
          
          fetch(`${process.env.REACT_APP_PUBLIC_URL}/qto/`,{
            headers: {
              'Authorization': 'Bearer '+ String(access_token)
            }
          })
            .then((response) => response.json())
            
            .then((data) =>
              
             setDataTable(data));
           
           
        })
        
        .finally(() => {
          setShowUploadDiv(false);
          
        });
      
      }
      })
    
      };

      const handleFileInputChange = (e) => {
        setFile(e.target.files[0]);
      };
    return (
        <div className='content'> 
           {alert}

            
           

            

            {showPopup &&(
     <div className="backdrop">
       <div className="popup-qto">
              <Card>
          <CardHeader>
            <CardTitle tag="h4">Metraj ekle</CardTitle>
          </CardHeader>
          <CardBody style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto' }}>
    <div className="form-item">
        <label>Bina Adı</label>
        <Select
            key={selectedBuilding}
            value={buildingOptions.find(option => option.value === selectedBuilding)}
            onChange={(option) => handleBuildingChange(option.value)}
            options={buildingOptions}
            placeholder="Select Building"
            styles={customStyles}
            menuPortalTarget={document.body}
        />
    </div>

    <div className="form-item">
        <label>Kat Adı</label>
        <Select
            key={selectedElevation}
            value={elevationOptions.find(option => option.value === selectedElevation)}
            onChange={(option) => handleElevationChange(option.value)}
            options={elevationOptions}
            placeholder="Select Elevation"
            isDisabled={!selectedBuilding}
            styles={customStyles}
            menuPortalTarget={document.body}
        />
    </div>

    <div className="form-item">
        <label>Bölüm Adı</label>
        <Select
             key={selectedSection}
            value={sectionOptions.find(option => option.value === selectedSection)}
            onChange={(option) => handleSectionChange(option.value)}
            options={sectionOptions}
            placeholder="Select Section"
            isDisabled={!selectedElevation}
            styles={customStyles}
            menuPortalTarget={document.body}
        />
    </div>

    <div className="form-item">
        <label>Yer Adı</label>
        <Select
             key={selectedPlace}
            value={placeOptions.find(option => option.value === selectedPlace)}
            onChange={(option) => setSelectedPlace(option.value)}
            options={placeOptions}
            placeholder="Select Place"
            isDisabled={!selectedSection}
            styles={customStyles}
            menuPortalTarget={document.body}
        />
    </div>

    <div className="form-item">
        <label>Poz Kodu</label>
        <Input 
            type="text" 
            placeholder="Pose Code" 
            
            onChange={(e) => setPoseCode(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Üretim Kodu</label>
        <Input 
            type="text" 
            placeholder="Manufacturing Code" 
            
            onChange={(e) => setManufacturingCode(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Malzeme</label>
        <Input 
            type="text" 
            placeholder="Material" 
             
            onChange={(e) => setMaterial(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Açıklama</label>
        <Input 
            type="text" 
            placeholder="Description" 
             
            onChange={(e) => setDescription(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Genişleme</label>
        <Input 
            type="text" 
            placeholder="Width" 
             
            onChange={(e) => setWidth(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Derinlik</label>
        <Input 
            type="text" 
            placeholder="Depth" 
            
            onChange={(e) => setDepth(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Yükseklik</label>
        <Input 
            type="text" 
            placeholder="Height" 
             
            onChange={(e) => setHeight(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Miktar</label>
        <Input 
            type="text" 
            placeholder="Quantity" 
            
            onChange={(e) => setQuantity(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Birim</label>
        <Input 
            type="text" 
            placeholder="Unit" 
            
            onChange={(e) => setUnit(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Çarpan</label>
        <Input 
            type="text" 
            placeholder="Multiplier" 
             
            onChange={(e) => setMultiplier(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Çarpan2</label>
        <Input 
            type="text" 
            placeholder="Multiplier2" 
            
            onChange={(e) => setMultiplier2(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Alma</label>
        <Input 
            type="text" 
            placeholder="Take Out" 
            
            onChange={(e) => setTakeOut(e.target.value)} 
        />
    </div>

 
</CardBody>

          <CardFooter>
          <Button  className="btn-round" color="success" type="submit" onClick={handleSubmit}>Onayla</Button>
              
            
            <Button className="btn-round" color="danger" type="submit" onClick={handleCancel}>
              İptal Et
            </Button>
          </CardFooter>
        </Card>

            </div>
            </div>
)}

{showEditPopup &&(
  
       <div className="popup">
              <Card>
          <CardHeader>
            <CardTitle tag="h4">Metraj Düzenle</CardTitle>
          </CardHeader>
          <CardBody >
          
    <div className="form-group-col">
        <label>Bina Adı</label>
        <Select
            name="building_name"
            value={buildingOptions.find(option => option.value === selectedBuilding)}
            onChange={(option) => handleBuildingChange(option.value)}
            options={buildingOptions}
            placeholder="Select Building"
           
        />
   

    
        <label>Kat Adı</label>
        <Select
            name="floor_name"
            value={elevationOptions.find(option => option.value === selectedElevation)}
            onChange={(option) => handleElevationChange(option.value)}
            options={elevationOptions}
            placeholder="Select Elevation"
            isDisabled={!selectedBuilding}
           
        />
    

   
        <label>Bölüm Adı</label>
        <Select
            
            value={sectionOptions.find(option => option.value === selectedSection)}
            onChange={(option) => handleSectionChange(option.value)}
            options={sectionOptions}
            placeholder="Select Section"
            isDisabled={!selectedElevation}
           
        />
   

   
        <label>Yer Adı</label>
        <Select
           
            value={placeOptions.find(option => option.value === selectedPlace)}
            onChange={(option) => setSelectedPlace(option.value)}
            options={placeOptions}
            placeholder="Select Place"
            isDisabled={!selectedSection}
           
        />
    </div>

    <div className="form-group-col">
        <label>Poz Kodu</label>
        <Input 
            type="text" 
            placeholder="Pose Code" 
            value={poseCode}
            onChange={(e) => setPoseCode(e.target.value)} 
        />
    
 <label>Poz Numarası</label>
        <Input 
            type="text" 
            placeholder="Pose Number" 
            value={poseNumber}
            onChange={(e) => setPoseNumber(e.target.value)} 
        />
    
  
        <label>Üretim Kodu</label>
        <Input 
            type="text" 
            placeholder="Manufacturing Code" 
            value={manufacturingCode}
            onChange={(e) => setManufacturingCode(e.target.value)} 
        />
    

   
        <label>Malzeme</label>
        <Input 
            type="text" 
            placeholder="Material" 
             value={material}
            onChange={(e) => setMaterial(e.target.value)} 
        />
    

   
        <label>Açıklama</label>
        <Input 
            type="text" 
            placeholder="Description" 
             value={description}
            onChange={(e) => setDescription(e.target.value)} 
        />
    </div>

    <div className="form-group-col">
        <label>Genişlik</label>
        <Input 
            type="text" 
            placeholder="Width" 
             value={width}
            onChange={(e) => setWidth(e.target.value)} 
        />
   

    
        <label>Derinlik</label>
        <Input 
            type="text" 
            placeholder="Depth" 
            value={depth}
            onChange={(e) => setDepth(e.target.value)} 
        />
  

   
        <label>Yükseklik</label>
        <Input 
            type="text" 
            placeholder="Height" 
             value={height}
            onChange={(e) => setHeight(e.target.value)} 
        />
    

    
        <label>Miktar</label>
        <Input 
            type="text" 
            placeholder="Quantity" 
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)} 
        />
    </div>

    <div className="form-group-col">
        <label>Birim</label>
        <Input 
            type="text" 
            placeholder="Unit" 
            value={unit}
            onChange={(e) => setUnit(e.target.value)} 
        />
   

    
        <label>Çarpan</label>
        <Input 
            type="text" 
            placeholder="Multiplier" 
             value={multiplier}
            onChange={(e) => setMultiplier(e.target.value)} 
        />
   

    
        <label>Çarpan2</label>
        <Input 
            type="text" 
            placeholder="Multiplier2" 
            value={multiplier2}
            onChange={(e) => setMultiplier2(e.target.value)} 
        />
    

   
        <label>Alma</label>
        <Input 
            type="text" 
            placeholder="Take Out" 
            value={takeOut}
            onChange={(e) => setTakeOut(e.target.value)} 

            
        />

<div className="form-item">
        <label>Toplam</label>
        <Input 
            type="text" 
            placeholder="Toplam" 
            value={total}
            onChange={(e) => setTotal(e.target.value)} 
            disabled
        />
    </div>
    </div>
</CardBody>

          <CardFooter>
          <Button  className="btn-round" color="success" type="submit" onClick={handleEdit}>Onayla</Button>
              
            
            <Button className="btn-round" color="danger" type="submit" onClick={handleCancel}>
              İptal Et
            </Button>
          </CardFooter>
        </Card>

            </div>
         
)}
<Card>
              <CardHeader>
                <CardTitle tag='h4'>METRAJ GİRİŞ</CardTitle>
              </CardHeader>
              <CardBody>
              <div className="upload-container">
            
        <div className="d-flex justify-content-between align-items-center">
          
          {!isAdding && <Button  className="my-button-class" color="primary" onClick={() => setShowPopup(true)}>+ EKLE</Button>}
        </div>
    



         </div>    
              

              
              </CardBody>
            </Card>
             <Card >
              
              <CardBody >

            
                <ReactTable
                  data={dataTable.map((row,index) => ({
                    id: row[0],
                    building_name: row[1] ? row[1].name : null,
                    elevation_or_floor_name: row[2] ? row[2].name : null,
                    section_name: row[3] ? row[3].name : null,
                    place_name: row[4] ? row[4].name : null, // Added a check here
pose_code: row[5],
pose_number: row[6],
manufacturing_code: row[7],
material: row[8],
description: row[9],
width: row[10],
depth: row[11],
height: row[12],
quantity: row[13],
unit: row[14],
multiplier: row[15],
multiplier2: row[16],
take_out: row[17],
total: row[18],

                   
                    

                    actions: (
                      <div className='actions-left'>
                       
                         <Button
                          disabled={showEditPopup}
                          onClick={() => {
                            // Enable edit mode
                            
                           {handleClick(row)}
                           
                          
                          }}
                          
                          color='warning'
                          size='sm'
                          className='btn-icon btn-link edit'
                        >
                          <i className='fa fa-edit' />
                        </Button>{' '}
                        
                        <>
    
    
                          <Button
                            disabled={showEditPopup}
                            onClick={() => {
                              
                               warningWithConfirmAndCancelMessage() 
                               const rowToDelete = {...row};
                               const data = {
                               qto_id: rowToDelete[0],

                              };
                              setDeleteData(data);
                              console.log(deleteConfirm)


                            }
                            }
                            color="danger"
                            size="sm"
                            className="btn-icon btn-link remove"
                          >
                            <i className="fa fa-times" />
                          </Button>
    
  </>


                      </div>
                    ),
                  }))}
                  columns={[
                    
                    {
                        Header: 'Bina Adı',
                        accessor: 'building_name',
                    },
                    {
                        Header: 'Kat Adı veya Kat Sayısı',
                        accessor: 'elevation_or_floor_name',
                    },
                    {
                        Header: 'Bölüm Adı',
                        accessor: 'section_name',
                    },
                    {
                        Header: 'Yer Adı',
                        accessor: 'place_name',
                    },
                    {
                        Header: 'Poz Kodu',
                        accessor: 'pose_code',
                    },
                    {
                        Header: 'Poz Numarası',
                        accessor: 'pose_number',
                    },
                    {
                        Header: 'Üretim Kodu',
                        accessor: 'manufacturing_code',
                    },
                    {
                        Header: 'Malzeme',
                        accessor: 'material',
                    },
                    {
                        Header: 'Açıklama',
                        accessor: 'description',
                    },
                    {
                        Header: 'Genişlik',
                        accessor: 'width',
                    },
                    {
                        Header: 'Derinlik',
                        accessor: 'depth',
                    },
                    {
                        Header: 'Yükseklik',
                        accessor: 'height',
                    },
                    {
                        Header: 'Miktar',
                        accessor: 'quantity',
                    },
                    {
                        Header: 'Birim',
                        accessor: 'unit',
                    },
                    {
                        Header: 'Çarpan',
                        accessor: 'multiplier',
                    },
                    {
                        Header: 'Çarpan2',
                        accessor: 'multiplier2',
                    },
                    {
                        Header: 'Alma',
                        accessor: 'take_out',
                    },
                    {
                        Header: 'Toplam',
                        accessor: 'total',
                    },
                    {
                        Header: 'İşlem',
                        accessor: 'actions',
                        sortable: false,
                        filterable: false,
                    },
                ]}
                
                  
                  defaultPageSize={10}
                  className='-striped -highlight'
                />
              </CardBody>
            </Card>
           
        </div>
    );
}

export default QTOForm;