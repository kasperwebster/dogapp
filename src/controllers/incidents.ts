import { Request, Response } from 'express';
import Incident from '../models/Incident';

// Get all incidents (public)
export const getIncidents = async (req: Request, res: Response) => {
  try {
    // Only return approved incidents for public users
    const incidents = await Incident.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(incidents);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get all incidents (admin)
export const getAllIncidents = async (req: Request, res: Response) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json(incidents);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get incident by ID
export const getIncidentById = async (req: Request, res: Response) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    res.json(incident);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new incident
export const createIncident = async (req: Request, res: Response) => {
  try {
    const { title, description, location, dogBreed, severity, date } = req.body;

    const incident = await Incident.create({
      title,
      description,
      location,
      dogBreed,
      severity,
      date,
      reportedBy: req.user?._id,
      // Auto-approve if admin, otherwise pending
      status: req.user?.role === 'admin' ? 'approved' : 'pending',
    });

    res.status(201).json(incident);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update incident status (admin only)
export const updateIncidentStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json(incident);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete incident (admin only)
export const deleteIncident = async (req: Request, res: Response) => {
  try {
    const incident = await Incident.findByIdAndDelete(req.params.id);
    
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json({ message: 'Incident deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Mark incident as helpful
export const markHelpful = async (req: Request, res: Response) => {
  try {
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json(incident);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 