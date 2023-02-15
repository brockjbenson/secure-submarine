const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");
const router = express.Router();

router.get("/", rejectUnauthenticated, (req, res) => {
  // what is the value of req.user????
  console.log("req.user:", req.user);

  if (req.user.clearance_level >= 13) {
    pool
      .query(`SELECT * FROM "secret";`)
      .then((results) => res.send(results.rows))
      .catch((error) => {
        console.log("Error making SELECT for secrets:", error);
        res.sendStatus(500);
      });
  } else {
    let queryText = `SELECT * FROM "secret" WHERE "secrecy_level" <= $1`;
    pool
      .query(queryText, [req.user.clearance_level])
      .then((result) => {
        res.send(result.rows);
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  }
});

module.exports = router;
