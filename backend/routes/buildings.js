// buildings.js - Buildings route module.

var express = require('express');
var router = express.Router();
const pool = require('../mysql')

const formatSearchQuery = (searchQuery) => {
    var formattedQuery = ``;
    if (searchQuery != "[]" && searchQuery != '') {
        const params = JSON.parse(searchQuery);
        const searchTerm = params.searchTerm;
        const searchableColumns = params.columns;
        if (searchTerm != '' && searchableColumns != '') {
            formattedQuery = ` WHERE concat(${searchableColumns}) like '%${searchTerm}%'`
        }
    }
    return formattedQuery;
}

const formatSortQuery = (sortQuery) => {
    var formattedQuery = ``;
    if (sortQuery != "[]" && sortQuery != '') {
        const params = JSON.parse(sortQuery)[0];
        const selector = params.selector;
        formattedQuery = ` ORDER BY ${selector}`
        if (params.desc == true) {
            formattedQuery += ` DESC`
        }
    }
    return formattedQuery;
}

router.get('/', (req, res) => {
    const searchQuery = formatSearchQuery(req.query.search);
    const sortQuery = formatSortQuery(req.query.sort);
    const skip = req.query.skip;
    const take = req.query.take;

    const query = `SELECT * FROM buildings${searchQuery}${sortQuery} LIMIT ${skip}, ${take}`;
    console.log("Query: " + query)
    pool.execute(query, (err, rows) => {
        if (err) {
            res.send(err);
        }
        else if (req.query.requireTotalCount == 'true') {
            // Append total row count to response object
            const countQuery = `select count(*) from buildings${searchQuery}`;
            pool.query(countQuery, (err, countObject) => {
                if (err) {
                    res.send(err);
                } else {
                    const count = countObject[0]['count(*)'];
                    const jsonObj = {
                        data: rows,
                        totalCount: count
                    }
                    res.send(jsonObj);
                }
            });
        } else {
            // Only rows without total count
            res.send(rows);
        }
    });
});

router.get('/:buildingId', (req, res) => {
    const query = 
    `SELECT b.idbuildings, building_identifier, building_name, country, city, typology, construction_type, A1A3, A4, B4_m, B4_t
    FROM buildings AS b
    INNER JOIN location AS l
    ON b.idlocation = l.idlocation
    INNER JOIN typology AS t
    ON b.idtypology = t.idtypology
    INNER JOIN constructiontype AS c
    ON b.idconstruction_type = c.idconstruction_type
    INNER JOIN buildingelements as be
    ON b.idbuildings = be.idbuildings
    WHERE b.idbuildings = ${req.params.buildingId} AND be.idlevels = 0`;

    console.log("Get building")
    pool.query(query, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
});

module.exports = router;