import React, { useState } from "react";
import { Button, Modal } from "flowbite-react";
import { getLS } from "../DataServices/LocalStorage";

export default function ModalComponent() {
    const [openModal, setModal] = useState(false);
    const favorites = getLS()
  return (
    <>
      <button className="overflow-y-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-96 h-15 text-center" onClick={() =>setModal(true)}>
        <p>Show Favorites</p>
        </button>
        <Modal className="bg-gray-800 text-white" dismissible show={openModal} onClose={()=> setModal(false)}>
            <Modal.Header className="bg-gray-700">
                <div className="text-white">Favorited Pokemon
                    </div>
            </Modal.Header>
            <Modal.Body className="bg-gray-700">
                <div className="space-y-6">
                    {favorites.map((pokiname:string) =>{
                        return <p>{pokiname}</p>
                    })}
                  
                </div>
            </Modal.Body>
        </Modal>
    </>
  );
}
