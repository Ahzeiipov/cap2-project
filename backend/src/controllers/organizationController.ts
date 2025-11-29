import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Organization } from '../models/organization'

export class OrganizationController {
  private normalize(doc: any) {
    if (!doc) return null
    const { _id, __v, ...rest } = doc
    return { id: _id ? String(_id) : undefined, ...rest }
  }

  // GET all organizations
  async getAll(req: Request, res: Response) {
    try {
      const list = await Organization.find().sort({ createdAt: -1 }).lean()
      res.json({ data: list.map((item) => this.normalize(item)) })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to fetch organizations' })
    }
  }

  // GET organization by ID
  async getById(req: Request, res: Response) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
      const item = await Organization.findById(req.params.id).lean()
      if (!item) return res.status(404).json({ error: 'Not found' })
      res.json({ data: this.normalize(item) })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to fetch organization' })
    }
  }

  // POST create organization
  async create(req: Request, res: Response) {
    try {
      const { name, type, recordType, network, logo } = req.body
      if (!name) return res.status(400).json({ error: 'name is required' })

      const doc = await Organization.create({
        name,
        type: type || undefined,
        recordType: recordType || undefined,
        network: network || undefined,
        logo: logo || undefined,
      })
      res.status(201).json({ data: this.normalize(doc.toObject()) })
    } catch (err: any) {
      console.error(err)
      res.status(400).json({ error: err.message || 'Failed to create organization' })
    }
  }

  // PUT update organization
  async update(req: Request, res: Response) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
      const updated = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean()
      if (!updated) return res.status(404).json({ error: 'Not found' })
      res.json({ data: this.normalize(updated) })
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: 'Failed to update organization' })
    }
  }

  // DELETE organization
  async delete(req: Request, res: Response) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
      const removed = await Organization.findByIdAndDelete(req.params.id)
      if (!removed) return res.status(404).json({ error: 'Not found' })
      res.status(204).send()
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to delete organization' })
    }
  }
}