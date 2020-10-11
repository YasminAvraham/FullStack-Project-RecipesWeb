CREATE TABLE Users(
	Username varchar(20) NOT NULL PRIMARY KEY ,
	UserPassword varchar(300) NOT NULL,
	FirstName varchar(20) NOT NULL,
	LastName varchar(20) NOT NULL,
	Country varchar(20) NOT NULL,
	Email varchar(30) NOT NULL,
	ImageURL varchar(500),

	);


CREATE TABLE UserFavorites(
	Username varchar(20) NOT NULL,
	RecipeID integer NOT NULL,
	CONSTRAINT PK_Favorite PRIMARY KEY (Username,RecipeID),
	FOREIGN KEY (Username) REFERENCES Users(Username)
);


CREATE TABLE UserRecipeViews(
	Username varchar(20) NOT NULL,
	RecipeID integer NOT NULL,
	LastView Date NOT NULL,
	CONSTRAINT PK_UserRecipeViews PRIMARY KEY (Username,RecipeID),
	FOREIGN KEY (Username) REFERENCES Users(Username)
);


CREATE TABLE UserRecipes (
	Username varchar(20) NOT NULL,
	Recipe_id [UNIQUEIDENTIFIER] NOT NULL default NEWID(),
	RecipeTitle varchar(70) NOT NULL,
	RecipeData nvarchar(MAX) NOT NULL
	CONSTRAINT PK_UserRecipes PRIMARY KEY (Username,Recipe_id),
	FOREIGN KEY (Username) REFERENCES Users(Username)
);

CREATE TABLE UserFamilyRecipes (
	Username varchar(20) NOT NULL,
	Recipe_id [UNIQUEIDENTIFIER] NOT NULL default NEWID(),
	RecipeTitle varchar(70) NOT NULL,
	RecipeData nvarchar(MAX) NOT NULL
	CONSTRAINT PK_UserFamilyRecipes PRIMARY KEY (Username,Recipe_id),
	FOREIGN KEY (Username) REFERENCES Users(Username)
);