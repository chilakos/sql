


const { Connection, Request } = require("tedious");

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "SQLDB_User", // update me
      password: "Password" // update me
    },
    type: "default"
  },
  server: "mysrv.database.windows.net", // update me
  options: {
    database: "AdventureWorks", //update me
    encrypt: true,
	cryptoCredentialsDetails:
	{
		secureProtocol : 'TLSv1_2_method' ///update me - TLSv1_2_method, TLSv1_1_method,TLSv1_method	
	}
	
  }
};

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
  } else {
    queryDatabase();
  }
});

function queryDatabase() {
  console.log("Reading rows from the Table...");

  // Read all rows from table
  const request = new Request(
    `SELECT TOP 20 pc.Name as CategoryName,
                   p.name as ProductName
     FROM [SalesLT].[ProductCategory] pc
     JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid`, //Update me - Query only works for AdeventureWorks
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  request.on("row", columns => {
    columns.forEach(column => {
      console.log("%s\t%s", column.metadata.colName, column.value);
    });
  });

  connection.execSql(request);
}