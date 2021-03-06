import junit.framework.TestCase;

/**
 * A tester class for the MazeRace class
 */
public class MazeRaceTester extends TestCase {
 
  /**
   * Test the constructor of the MazeRace class and getGrid method.
   */
  public void testConstructor() {
    
    //call the constructor with a 1 by 1 grid.
    char[][] empty = new char[1][1];
    MazeRace maze = new MazeRace(empty);
    //the grid that the maze contains should also be empty.
    char[][] setup = maze.getGrid();
    assertEquals ( 1, setup.length);
    assertEquals (1,setup[0].length);
    
    //create a maze using normalGrid.
    //create a 9 X 6 grid..
    char[][] normalGrid = {
    { 'X','X','X','X','X','X','X','X','X'},
    { 'X','G',' ',' ','C','X',' ',' ','X'},
    { 'X',' ',' ',' ',' ',' ',' ',' ','X'},
    { 'X',' ',' ',' ',' ',' ',' ',' ','X'},
    { 'X',' ',' ',' ',' ','X','A',' ','X'},
    { 'X','X','X','X','X','X','X','X','X'}};
    MazeRace maze2 = new MazeRace(normalGrid);
    //the grid that maze2 contains should be 9 X 6.
    char[][] setup2 = maze2.getGrid();
    assertEquals (6,setup2.length); //6 rows
    assertEquals (9,setup2[0].length); //9 columns
  }
    
  /**
   * Test the toString method
   */
  public void testToString() {
    //create a maze using an 1 by 1 grid.
    char[][] empty = new char[1][1];
    MazeRace maze = new MazeRace(empty);
    
    //the toString method should return an blank string " ".
    assertEquals (" ", maze.toString());
    
    //create a maze using a normal grid.
    //create a 9 X 6 grid..
    char[][] normalGrid = {
    { 'X','X','X','X','X','X','X','X','X'},
    { 'X','G',' ',' ','C','X',' ',' ','X'},
    { 'X',' ',' ',' ',' ',' ',' ',' ','X'},
    { 'X',' ',' ',' ',' ',' ',' ',' ','X'},
    { 'X',' ',' ',' ',' ','X','A',' ','X'},
    { 'X','X','X','X','X','X','X','X','X'}};
    MazeRace maze2 = new MazeRace(normalGrid);
    assertEquals ("XXXXXXXXX\n"+ "XG  CX  X\n"+ "X       X\n"+ "X       X\n"
                    + "X    XA X\n" + "XXXXXXXXX", maze2.toString());
  }
  
  /**
   * Test the numAdaMoves method.
   */
  public void testNumAdaMoves() {
    //create a maze using a normal grid.
    char[][] normalGrid = {
    { 'X','X','X','X','X','X','X','X','X'},
    { 'X','G',' ',' ','C','X',' ',' ','X'},
    { 'X',' ',' ',' ',' ',' ',' ',' ','X'},
    { 'X',' ',' ',' ',' ',' ',' ',' ','X'},
    { 'X',' ',' ',' ',' ','X','A',' ','X'},
    { 'X','X','X','X','X','X','X','X','X'}};
    MazeRace maze = new MazeRace(normalGrid);
    
    //get ada's move and store in a temp variable.
    int temp = maze.numAdaMoves();
    
    //make an illegal move with ada.
    maze.move('s');
    assertEquals (temp, maze.numAdaMoves());
    
    //make a legal move with ada.
    maze.move('w');
    assertEquals (temp + 1, maze.numAdaMoves());
  }
  
  /**
   * Test the numCharlesMoves method.
   */
  public void testNumCharlesMoves() {
    //create a maze using a normal grid.
    char[][] normalGrid = {
    { 'X','X','X','X','X','X','X','X','X'},
    { 'X','G',' ',' ','C','X',' ',' ','X'},
    { 'X',' ',' ',' ',' ',' ',' ',' ','X'},
    { 'X',' ',' ',' ',' ',' ',' ',' ','X'},
    { 'X',' ',' ',' ',' ','X','A',' ','X'},
    { 'X','X','X','X','X','X','X','X','X'}};
    MazeRace maze = new MazeRace(normalGrid);

    //get ada's move and store in a temp variable.
    int temp = maze.numAdaMoves();
    
    //make an illegal move with charles.
    maze.move('i');
    assertEquals (temp, maze.numCharlesMoves());
    
    //make a legal move with Charles.
    maze.move('k');
    assertEquals (temp + 1, maze.numCharlesMoves());
  }

  /**
   * Test the move method when all the moves are legal.
   */
  public void testMove() {
    //create a maze using a normal grid.
    char[][] normalGrid = {
    { 'X','X','X','X','X','X','X','X','X'},
    { 'X','G',' ',' ','C','X',' ',' ','X'},
    { 'X',' ',' ',' ',' ',' ',' ',' ','X'},
    { 'X',' ',' ',' ',' ',' ',' ',' ','X'},
    { 'X',' ',' ',' ',' ','X','A',' ','X'},
    { 'X','X','X','X','X','X','X','X','X'}};
    MazeRace maze = new MazeRace(normalGrid);
    
    //make series of legal moves for ada and test to see
    //if a)the player gets moved to the right spot
    //   b) the correct mark gets left behind the old spot
    //   c) if correct boolean value is returned.
    boolean legalMove = maze.move('d');//move right
    assertEquals (maze.getGrid()[4][7], 'A');
    assertEquals (maze.getGrid()[4][6],'.');
    assertTrue (legalMove);
    
    boolean legalMove2 = maze.move('w');//move up
    assertEquals (maze.getGrid()[3][7],'A');
    assertEquals (maze.getGrid()[4][7],'.');
    assertTrue (legalMove2);
    
    boolean legalMove3 = maze.move('a');//move left
    assertEquals (maze.getGrid()[3][6],'A');
    assertEquals (maze.getGrid()[3][7],'.');
    assertTrue (legalMove3);
    
   //move left 2 times and then move down
    boolean legalMove4 = maze.move('a');
    boolean legalMove5 = maze.move('a');
    boolean legalMove6 = maze.move('s');
    assertEquals (maze.getGrid()[4][4],'A');
    assertEquals (maze.getGrid()[3][6],'.');
    assertEquals (maze.getGrid()[3][5],'.');
    assertEquals (maze.getGrid()[3][4],'.');
    assertTrue (legalMove4);
    assertTrue (legalMove5);
    assertTrue (legalMove6);
    
    //now make series of legal moves for Charles and test to see
    //if a)the player gets moved to the right spot
    //   b) the correct mark gets left behind the old spot
    //   c) if correct boolean value is returned.
    boolean legalCharMove = maze.move('k');//move down
    assertEquals (maze.getGrid()[2][4], 'C');
    assertEquals (maze.getGrid()[1][4],'.');
    assertTrue (legalCharMove);
    
    boolean legalCharMove2 = maze.move('l');//move right
    assertEquals (maze.getGrid()[2][5],'C');
    assertEquals (maze.getGrid()[2][4],'.');
    assertTrue (legalCharMove2);
    
    boolean legalCharMove3 = maze.move('l');//move right
    assertEquals (maze.getGrid()[2][6],'C');
    assertEquals (maze.getGrid()[2][5],'.');
    assertTrue (legalCharMove3);
    
   //move right
    boolean legalCharMove4 = maze.move('l');
    assertEquals (maze.getGrid()[2][7],'C');
    assertEquals (maze.getGrid()[2][6],'.');
    assertTrue (legalCharMove4);
    
    //move up
    boolean legalCharMove5 = maze.move('i');
    assertEquals (maze.getGrid()[1][7],'C');
    assertEquals (maze.getGrid()[2][7],'.');
    assertTrue (legalCharMove5);
    
    //move left
    boolean legalCharMove6 = maze.move('j');
    assertEquals (maze.getGrid()[1][6],'C');
    assertEquals (maze.getGrid()[1][7],'.');
    assertTrue (legalCharMove6);
    
   }
  
   /**
   * Test the move method when the moves are illegal.
   */
  public void testIlligalMoves(){
    //create a maze using thin maze.
    //Create a thin 5X3 grid 
    char [][] thinGrid = {
    {'X','X','X','X','X'},
    {'X','G','C','A','X'},                
    {'X','X','X','X','X'}};
    MazeRace maze = new MazeRace(thinGrid);
    
    //make move up when they are blocked by walls
    //(illigal for both charles and ada).
    boolean adaMove = maze.move('w');
    boolean charMove = maze.move('i');
    assertFalse(adaMove);
    assertFalse(charMove);
    
    //make sure they are blocked by each other.
    //move ada into char
    boolean adaMove2 = maze.move('a');
    //charles into ada.
    boolean charMove2 = maze.move('l');
    assertFalse(adaMove2);
    assertFalse(charMove2);
    
    //make sure ada and char hasn't changed position after the above 
    //illigal moves.
    assertEquals ("XXXXX\n" + "XGCAX\n" + "XXXXX", maze.toString());
    
    //create a maze using normal grid.
    char[][] normalGrid = {
    { 'X','X','X','X','X','X','X','X','X'},
    { 'X','G',' ',' ','C','X',' ',' ','X'},
    { 'X',' ',' ',' ',' ',' ',' ',' ','X'},
    { 'X',' ',' ',' ',' ',' ',' ',' ','X'},
    { 'X',' ',' ',' ',' ','X','A',' ','X'},
    { 'X','X','X','X','X','X','X','X','X'}};
    MazeRace maze2 = new MazeRace(normalGrid);
    
    //make a move up and then down, to see if they are blocked by a used spot.
    boolean moveAda = maze2.move('w');
    boolean moveAda2 = maze2.move('s');
    assertFalse (moveAda2);
    
    //make sure the board stayed the same as it was after the first move.
    assertEquals ("XXXXXXXXX\n"+ "XG  CX  X\n"+ "X       X\n"+ "X     A X\n"
                    + "X    X. X\n" + "XXXXXXXXX", maze2.toString());
    
  }
  
  /**
   * Test the hasWon method
   */
  public void testHasWon() {
    //create a maze using thin maze.
    //Create a thin 5X3 grid 
    char [][] thinGrid = {
    {'X','X','X','X','X'},
    {'X','G','C','A','X'},                
    {'X','X','X','X','X'}};
    MazeRace maze = new MazeRace(thinGrid);
    
    //nobody won so it returns 0.
    int initialWinner = maze.hasWon();
    assertEquals (0,initialWinner);
    //move charles to the left so he wins.
    maze.move('j');
    int winner = maze.hasWon();
    assertEquals (2,winner);
    
    //make sure the grid gets updated correctly.
    assertEquals ("XXXXX\n" + "XC.AX\n" + "XXXXX", maze.toString());
    
    //create a simple maze so that Ada can win.
    char [][] adaGrid = {
    {'X','X','X','X','X'},
    {'X','G','A','C','X'},                
    {'X','X','X','X','X'}};
    MazeRace maze2 = new MazeRace(adaGrid);
    maze2.move('a');
    int winner2 = maze2.hasWon();
    assertEquals (1,winner2);
    assertEquals ("XXXXX\n" + "XA.CX\n" + "XXXXX", maze2.toString());
    
  }
  
  /**
   * Test the isEqual method with another maze of the same dimension.
   */
  public void testIsEqualSameDimension() {
    //create two different grid:
    char[][] grid1 = {
    { 'X','X','X','X','X','X','X','X','X'},
    { 'X','G',' ',' ','C','X',' ',' ','X'},
    { 'X',' ',' ',' ',' ',' ',' ',' ','X'},
    { 'X',' ',' ',' ',' ',' ',' ',' ','X'},
    { 'X',' ',' ',' ',' ','X','A',' ','X'},
    { 'X','X','X','X','X','X','X','X','X'}};
    
    char[][] grid2 = {
    { 'X','X','X','X','X','X','X','X','X'},
    { 'X',' ',' ',' ',' ','X',' ',' ','X'},
    { 'X',' ',' ',' ',' ',' ',' ',' ','X'},
    { 'X',' ',' ',' ',' ',' ','C','A','X'},
    { 'X',' ',' ',' ',' ','X',' ',' ','X'},
    { 'X','X','X','X','X','X','X','X','X'}};
    MazeRace maze1 = new MazeRace (grid1);
    MazeRace maze2 = new MazeRace (grid2);
    assertFalse (maze1.isEqual(maze2));
  }
  
  /**
   * Test the isEqual method with a maze if different dimension.
   */
  public void testIsEqualDifferent() {
     //create two different grid:
    char[][] grid1 = {
    { 'X','X','X','X','X','X','X','X','X'},
    { 'X','G',' ',' ','C','X',' ',' ','X'},
    { 'X',' ',' ',' ',' ',' ',' ',' ','X'},
    { 'X',' ',' ',' ',' ',' ',' ',' ','X'},
    { 'X',' ',' ',' ',' ','X','A',' ','X'},
    { 'X','X','X','X','X','X','X','X','X'}};
    
    char [][] grid2 = {
    {'X','X','X','X','X'},
    {'X','G','C','A','X'},                
    {'X','X','X','X','X'}};
    MazeRace maze1 = new MazeRace (grid1);
    MazeRace maze2 = new MazeRace (grid2);
    assertFalse (maze1.isEqual(maze2));
  }
  
  /**
   * Test the isBlocked method
   */
  public void testIsBlocked(){
    
    //create a maze using a grid where ada and charles can be blocked
    //by walls and an used spot.
    char[][] grid = {
    { 'X','X','X','X','X','X','X','X','X'},
    { 'X','G',' ','X',' ','X',' ',' ','X'},
    { 'X',' ',' ',' ','C',' ',' ',' ','X'},
    { 'X',' ',' ',' ',' ','X','X',' ','X'},
    { 'X',' ',' ',' ',' ','X',' ','A','X'},
    { 'X','X','X','X','X','X','X','X','X'}};

    MazeRace maze = new MazeRace(grid);
    
    //Move Ada into the blocked position.
    maze.move('a');
    //When the maze isn't blocked, the method returns false
    assertFalse(maze.isBlocked());
    
    //Move Charles into the blocked position.
    maze.move('i');
    //now they are all blocked.
    assertTrue (maze.isBlocked());
    
    //create a maze to demonstrate that a player can block another
    //player.
     char[][] grid2 = {
    { 'X','X','X','X','X','X','X','X','X'},
    { 'X','G',' ','X',' ','X',' ',' ','X'},
    { 'X',' ',' ',' ',' ',' ',' ',' ','X'},
    { 'X',' ',' ',' ',' ','X','X','C','X'},
    { 'X',' ',' ',' ',' ','X','A',' ','X'},
    { 'X','X','X','X','X','X','X','X','X'}};
     MazeRace maze2 = new MazeRace(grid2);
     //if charles moves down, he will block ada and charles himself
     //will be blocked by walls and the used spot.
     maze2.move('k');
     assertTrue (maze.isBlocked());
  }
  

  
}
