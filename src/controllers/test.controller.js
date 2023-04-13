const testRepository = require("../repository/test.repo.js")
const {TestEntity} = require("../models/test.model")

function createTest(req,res) {
    const {nama,title,status} = req.body
    const data = new TestEntity(nama,title,status)
    testRepository.createTest(data,function(err,result) {
        if (err) {
            return res.status(400).json({message: "Something went wrong"})
        } else {
            return res.status(201).json({
                data: result,
                message: "Successfully Added"
            })
        }
    })
}

function getData(req,res) {
    testRepository.getAllData(function(err,result) {
        if (err) {
            return res.status(400).json({message: "Something went wrong"})
        } else {
            return res.status(200).json({
                data: result
            })
        }
    })
}

module.exports ={createTest,getData}