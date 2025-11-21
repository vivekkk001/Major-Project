// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ComplaintsLog {
    struct ComplaintEntry {
        string complaintId;
        uint timestamp;
        string[] statusUpdates;
    }

    // Mapping from complaintId to ComplaintEntry
    mapping(string => ComplaintEntry) private complaints;

    event ComplaintAdded(string complaintId, uint timestamp);
    event StatusUpdated(string complaintId, string newStatus);

    // Add a new complaint (called during first database insert)
    function addComplaint(string memory _complaintId) public {
        require(bytes(complaints[_complaintId].complaintId).length == 0, "Complaint already exists");

        complaints[_complaintId].complaintId = _complaintId;
        complaints[_complaintId].timestamp = block.timestamp;
        complaints[_complaintId].statusUpdates.push("Pending");

        emit ComplaintAdded(_complaintId, block.timestamp);
    }

    // Add a new status update (e.g. "In Progress" or "Resolved")
    function updateStatus(string memory _complaintId, string memory _newStatus) public {
        require(bytes(complaints[_complaintId].complaintId).length != 0, "Complaint does not exist");

        complaints[_complaintId].statusUpdates.push(_newStatus);

        emit StatusUpdated(_complaintId, _newStatus);
    }

    // View complaint data (for verification in frontend or testing)
    function getComplaint(string memory _complaintId) public view returns (
        string memory complaintId,
        uint timestamp,
        string[] memory statusUpdates
    ) {
        require(bytes(complaints[_complaintId].complaintId).length != 0, "Complaint does not exist");

        ComplaintEntry memory entry = complaints[_complaintId];
        return (entry.complaintId, entry.timestamp, entry.statusUpdates);
    }
}
