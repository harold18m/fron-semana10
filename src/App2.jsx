import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function GroupCrud() {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [editingGroup, setEditingGroup] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8090/api/groups');
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddGroup = async () => {
    try {
      const response = await fetch('http://localhost:8090/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGroup),
      });

      if (response.ok) {
        fetchData();
        setNewGroup({ name: '', description: '' });
        handleCloseModal();
      } else {
        console.error('Error adding group:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding group:', error);
    }
  };

  const handleEditGroup = async () => {
    try {
      const response = await fetch(`http://localhost:8090/api/groups/${editingGroup.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingGroup),
      });

      if (response.ok) {
        fetchData();
        setEditingGroup(null);
        handleCloseModal();
      } else {
        console.error('Error editing group:', response.statusText);
      }
    } catch (error) {
      console.error('Error editing group:', error);
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      const response = await fetch(`http://localhost:8090/api/groups/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      } else {
        console.error('Error deleting group:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  const handleShowModal = (group) => {
    setShowModal(true);
    if (group) {
      setEditingGroup(group);
      setNewGroup({ name: group.name, description: group.description });
    } else {
      setEditingGroup(null);
      setNewGroup({ name: '', description: '' });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGroup(null);
    setNewGroup({ name: '', description: '' });
  };

  return (
    <div className="container mt-4">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr key={group.id}>
              <td>{group.id}</td>
              <td>{group.name}</td>
              <td>{group.description}</td>
              <td>
                <Button variant="primary" onClick={() => handleShowModal(group)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteGroup(group.id)}
                  className="ml-2"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="success" onClick={() => handleShowModal()}>
        Add Group
      </Button>

      {/* Modal for adding/editing group */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingGroup ? 'Edit Group' : 'Add Group'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formGroupName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter group name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formGroupDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter group description"
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={editingGroup ? handleEditGroup : handleAddGroup}>
            {editingGroup ? 'Save Changes' : 'Add Group'}
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GroupCrud;
