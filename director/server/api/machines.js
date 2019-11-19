const routes = require('express').Router();
var Machine = require('../models/machine');
const mongoose = require("mongoose");

module.exports = function () {
    routes.get("/", function(req, res) {
        console.log("Getting machines");
        Machine.find({}, 'name', function(err, docs) {
            if (err) {
                res.status(200).json([]);
            }
            res.status(200).json(docs);
        });
    });

    routes.post("/", function(req, res) {
        console.log("Creating machine");
        var machine = req.body;
        machine._id = new mongoose.Types.ObjectId;

        var m = new Machine(machine);
        m.save(function() {
            res.status(201).json(m);
        });
    });


    routes.get("/:id", function(req, res) {
        Machine.findOne({_id: req.params.id}, function(err, machine) {
            res.status(200).json(machine);
        });
    });

    routes.post("/:id/sequences", function(req, res) {
        var seq = req.body;
        seq._id = new mongoose.Types.ObjectId;
        Machine.findOne({_id: req.params.id}, function(err, machine) {
            machine.sequences.push(seq);
            machine.save(function() {
                res.status(201).json(seq);
            });
        });
    });

    routes.get("/:id/sequences/:seq", function(req, res) {
        Machine.findOne({_id: req.params.id}, function(err, machine) {
            var seq = machine.sequences.id(req.params.seq);
            res.status(200).json(seq);
        });
    });


    routes.post("/:id/sequences/:seq", function(req, res) {
        var seq = req.body;
        Machine.findOne({_id: req.params.id}, function(err, machine) {
            var targ = machine.sequences.id(req.params.seq);
            Object.assign(targ, seq);
            machine.save(function() {
                res.status(201).json(seq);
            });
        });
    });

    routes.post("/:id/sequences/:seq/components", function(req, res) {
        var comp = req.body;
        comp._id = new mongoose.Types.ObjectId;
        Machine.findOne({_id: req.params.id}, function(err, machine) {
            var seq = machine.sequences.id(req.params.seq);
            seq.components.push(comp);
            machine.save(function() {
                res.status(201).json(comp);
            });
        });
    });
    
    return routes;
}