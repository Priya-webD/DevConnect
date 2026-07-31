import Connection from '../models/Connection.js';

export const sendRequest = async (req, res) => {
  try {
    const requesterId = req.user.id;
    const recipientId = req.params.userId;

    if (requesterId === recipientId) {
      return res.status(400).json({ message: "You can't connect with yourself" });
    }

    const existing = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });
    if (existing) return res.status(400).json({ message: 'Connection already exists' });

    const connection = await Connection.create({ requester: requesterId, recipient: recipientId });
    res.status(201).json({ connection });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const conn = await Connection.findById(req.params.requestId);
    if (!conn) return res.status(404).json({ message: 'Request not found' });
    if (conn.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    conn.status = 'accepted';
    await conn.save();
    res.status(200).json({ connection: conn });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const conn = await Connection.findById(req.params.requestId);
    if (!conn) return res.status(404).json({ message: 'Request not found' });
    if (conn.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    conn.status = 'rejected';
    await conn.save();
    res.status(200).json({ connection: conn });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyConnections = async (req, res) => {
  try {
    const userId = req.user.id;
    const connections = await Connection.find({
      status: 'accepted',
      $or: [{ requester: userId }, { recipient: userId }],
    }).populate('requester recipient', 'name email avatar');
    res.status(200).json({ connections });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const requests = await Connection.find({
      recipient: req.user.id,
      status: 'pending',
    }).populate('requester', 'name email avatar');
    res.status(200).json({ requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};