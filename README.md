#colonies
========

## Clone of simant

### Technologies Used

- Javascript
- HTML5 Canvas
- JQuery

### Finished

- Created map
- Animate ants
	+ Queen ant (big ant)
	+ Normal ant
- Select and move ants
	+ Left click to select ant
	+ Right click to move ant
- Underground
	+ Underground map consists of all dirt with tunnels
	+ Can create a nest populated with 4 larva
	+ Create tunnel to the underground by doubleclicking
	+ Ants can create tunnels (currently deactivated)
- Ant AI
	+ A-star implemented to let them navigate around obsticles
	+ Ants will randomaly move about the map on their own
	+ Move diagonally when appropriate
- Canvas Optimiziation
	+ Use background canvas for static entities like dirt, rocks, and grass (does not refresh)
	+ Use foreground canvas for moving entites like ants and food (refreshes at 60FPS)


### To-Do

+ Scrolling map
+ Create more underground buildings
+ Create ant types
+ Ant UI to gather food
+ Let queen create larva
+ Create resource UI
+ Set larva type (worker, nurse, soldier)
+ Randomly create food on the map
+ Create enemy colony and AI

### Ideas

+ More than just the two colonies in one patch (map) 
	- maybe don't even make it patches, instead make it one large world map and you can spread out new colonies

+ Add in other types of insects you can play as.
	- Termites
	- Fire ants
	- 

+ More complex AI

+ More dangerous insects/random events
	- Rain, snow, hail
	- Spider attack
	- Magnifying glass attack
	- Lawn mower
	- Trash pile (randomly generated repository of food)
	- Ant lion
	- Birds
	

+ Switch between different ants (soldier, worker, queen, princess)

+ Maybe ant levels up longer he lives

+ Buy new ant skills for your colony/ant

+ More complex pheromone trails
	- Pheromone patch for guarding
	- Path to food
	- Path to opposing nest
	- Patrol path
	- Attack path

+ Have to have a larger nest made for a larger colony

+ Structures
	- Nursery
	- Kitchen
	- Tunnels
	- Larder
	- Royal Chamber
	- Bunker

	- Fungi Farms
	- Midden Room

	- Outside
		+ bridges, leaves, ants
		+ roads

+ Ant Roles
	- Forager
	- Soldier
	- Midwifes
	- Princesses
	- Princes
	- Patroller
	- Janitors
	

+ Resources
	- Sugar
	- Ant Supply
	- Undigested Food

+ Aphid Farm
	- Move to sweeter parts of plant
	- Move aphids under leaves when rain is coming

+ Prey
	- Slugs
		+ Remove slim with dirt
	- Moths
	- Worms
	- Crabs
	- Cricket
	- Termites
		+ Find single, or mound

+ Wood ants harvest dried resin -  white chunks
	- distributes resin throughout the nest and when they walk on the resin,
	- the medicinal qualities of the resin disinfects the ants

+ Natural Disasters
	- Rain
	- Wind
	- Beetle Attacks

+ Queen produces eggs
	- set rate for egg production -  higher rate = more sugar
	- ants take the eggs to the nurseries
	- nurse ants take care of the eggs

+ Nursery
	- set hatch rate for eggs
		+ higher hatch speed
			- requires more sugar
			- requires more ants