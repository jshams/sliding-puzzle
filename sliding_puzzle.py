"""
Problem:
In a sliding puzzle a player can only move blocks to adjacent empty slot, the
goal is to arrange all blocks in to a certain pattern. Here is a simple version
of it: Given a 2 x 3 board of numbers from 0 to 5, where 0 represents an empty
slot, our goal is to order the blocks as [[1,2,3],[4,5,0]], only move allowedis
 to swap 0 with one of it’s neighbors in either direction (one of up, down,
 left, right). Given an puzzle we need to return the least number of moves
 needed to solve it, return -1 if it can not be solved.

How the solution works:
The way it works is by starting with the position of the zero (blank space)
creating the next 2-4 possible new board states (moves). These new board
states are added to a queue.
The queue will store new board states in the order they were seen and move
once (in each possible direction) for each of them creating new boards that are
added in line (queue). When a board is removed from the queue, new board states
are created and they are checked to see if they've been seen. If so it can be
disregarded because an indentical version of that board is already waiting
somewhere in line (queue) with fewer steps (this saves a LOT of time, allowing
the program to refrain from repeating unnecessary steps).
During each iteration the boards are also checked to see if they are solved.
If so, their counts of moves is returned along with the moves required. Because
each board is solved one step at a time in order it can be concluded that the
first set of moves found to solve a board is the fastest.
"""


from time import sleep
from queue import Queue
from heapq import heappush, heappop


def is_solved(puzzle):
    '''Returns a boolean indicating whether a board is solved or not'''
    # if the zero isnt in the bottom left corner dont search the whole board
    if puzzle[-1][-1] != 0:
        return False
    for x in range(len(puzzle)):
        for y in range(len(puzzle[-1])):
            if x == len(puzzle) - 1 and y == len(puzzle[-1]) - 1:
                continue
            if puzzle[x][y] != (x*len(puzzle[-1])) + (y + 1):
                return False
    return True


def find_zero(puzzle):
    '''Given a board, returns a tuple with the x,y coordinates of the zero.
    NOTE: This can be improved by keeping track of the 0 instead of searching
    for it every time'''
    for x in range(len(puzzle)):
        for y in range(len(puzzle[-1])):
            if puzzle[x][y] == 0:
                return x, y


def find_next_moves(puzzle):
    '''Given a puzzle this will find the coordinates of the 0 and return
    a tuple with x,y coordinates and a list of four new x,y coordinates or
    None if the 0 is in a corner or on an edge'''
    x, y = find_zero(puzzle)
    left = (x - 1, y) if x > 0 else None
    right = (x + 1, y) if x < len(puzzle) - 1 else None
    up = (x, y - 1) if y > 0 else None
    down = (x, y + 1) if y < len(puzzle[-1]) - 1 else None
    return (x, y), [left, right, up, down]


def swap(puzzle, start, next_move):
    '''Given a puzzle, a tuple with x,y 0 (start) coordinates, and the x,y
    coordinates of the next move, '''
    lst_pzl = tuple_puzzle_to_list(puzzle)
    sx, sy, nx, ny = *start, *next_move
    lst_pzl[sx][sy], lst_pzl[nx][ny] = lst_pzl[nx][ny], lst_pzl[sx][sy]
    return list_puzzle_to_tuple(lst_pzl)


def moves(puzzle):
    '''Given a puzzle this will find the next 2-4 possible moves, create
    2-4 new game boards, then returns a list of them. '''
    start, next_moves = find_next_moves(puzzle)
    new_boards = []
    for move in next_moves:
        if move is not None:
            new_board = swap(puzzle, start, move)
            new_boards.append((new_board, move))
    return new_boards


def tuple_puzzle_to_list(puzzle):
    '''Converts a board matrix from a tuple of tuples to a list of lists'''
    return list(list(row) for row in puzzle)


def list_puzzle_to_tuple(puzzle):
    '''Converts a board matrix from a list of lists to a tuple of tuples'''
    return tuple(tuple(row) for row in puzzle)


def manhattan_dist(puzzle):
    '''returns the manhattan distance of a board to its solved state
    This is the sum of the manhattan distances (aka l1 distance/ taxicab
    distance) from each number to its desired location.
    '''
    dist = 0
    for x in range(len(puzzle)):
        for y in range(len(puzzle[0])):
            if puzzle[x][y] != 0:
                val = puzzle[x][y]
                des_x, des_y = divmod(val - 1, len(puzzle[0]))
                dist += abs(x - des_x) + abs(y - des_y)
    return dist


def solve(original_puzzle):
    '''
    Calculates the minimum number of moves using breadth first search.
    returns -1 if no solutions exist. It also keeps track of the moves and
    returns a list of the moves (list of (x,y) coordinates of the zero position
    at each step).

    This works by creating a queue to store game board instances, and a set
    to store previous (already seen) game boards. The boards are also stored
    as tuples so they can be added to sets. Next it goes through each board
    in the queue and moves one move at a time creating up to four new boards
    on each move. The boards then get added to a queue with their number of
    moves, so long as they havent been seen. Then they are added to seen.
    Once a board is found that is solved, the number of moves is returned. If
    no board is found then it returns -1 to indicate the puzzle is unsolveable.

    Time complexity: O(n!) The number of possible board permutations from a
    board is is n! / 2. So the maximum number of boards required is n!. This
    algorithm is extremely unscalable. A 3x3 board can take up to 181,440
    iterations though a 3x4 can more than 1000 times longer at 239,500,800
    iterations.
    '''
    if not is_solveable(original_puzzle):
        return -1, None
    if type(original_puzzle) == list:
        original_puzzle = list_puzzle_to_tuple(original_puzzle)
    if is_solved(original_puzzle):
        return 0, []
    # Create a fifo queue to store boards
    # q.put(item, bool) put an item in the queue, if false dont
    # q.get() removes and returns the next item
    q = Queue()
    q.put((original_puzzle, 0, []))
    # create a set of seen boards to make sure we dont follow the same path
    # more than once
    seen = set()
    seen.add(original_puzzle)
    # search for a solved board till the queue is empty
    while not q.empty():
        # remove the next board from the queue, alone w num moves, and allmoves
        curr_board, num_moves, all_moves = q.get()
        # find the next possible board moves
        next_board_moves = moves(curr_board)
        # loop through the new boards
        for board, move in next_board_moves:
            # ensure the board has not been seen
            if board not in seen:
                # if so check if the board is solved
                if is_solved(board):
                    # if it is return the board and the moves
                    return num_moves + 1, all_moves + [move]
                # add the board, num_moves + 1, and all_moves +[move] to the q
                # NOTE: this could be way cleaner with a board class
                q.put((board, num_moves + 1, all_moves + [move]))
                # add the board to seen
                seen.add(board)
    # if the queue is empty it means all possible perms have been seen and none
    # were solved. no solution, return -1
    return -1, None


def optimized_solve(original_puzzle):
    '''Uses A* method with an heuristic for how solved a given puzzle  state
    is. Uses manhattan distance as the heuristic.'''
    if not is_solveable(original_puzzle):
        return -1, None
    if type(original_puzzle) == list:
        original_puzzle = list_puzzle_to_tuple(original_puzzle)
    if is_solved(original_puzzle):
        return 0, []
    min_heap = []
    man_dist = manhattan_dist(original_puzzle)
    min_heap.append((man_dist, original_puzzle, []))
    # create a set of seen boards to make sure we dont follow the same path
    # more than once
    seen = set()
    seen.add(original_puzzle)
    while len(min_heap) > 0:
        # remove the next board from the queue, alone w num moves, and allmoves
        _, curr_board, all_moves = heappop(min_heap)
        # find the next possible board moves
        next_board_moves = moves(curr_board)
        # loop through the new boards
        for board, move in next_board_moves:
            # ensure the board has not been seen
            if board not in seen:
                # if so check if the board is solved
                if is_solved(board):
                    # if it is return the board and the moves
                    return len(all_moves) + 1, all_moves + [move]
                # add the board, num_moves + 1, and all_moves +[move] to the q
                # NOTE: this could be way cleaner with a board class
                man_dist = manhattan_dist(board) + len(all_moves) + 1
                board_obj = man_dist, board, all_moves + [move]
                heappush(min_heap, board_obj)
                # add the board to seen
                seen.add(board)
    # if the queue is empty it means all possible perms have been seen and none
    # were solved. no solution, return -1
    return -1, None


def display_solution(board, min_moves, all_moves, sleep_len=1):
    '''prints the solution with fancy colors and dramatic pauses'''
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    END = '\033[0m'
    RED = '\033[91m'
    # YELLOW = '\033[93m'
    print('Start:')
    for row in board:
        print(f'\t{row}')
    print()
    zero_loc = find_zero(board)
    for itr, move in zip(range(1, min_moves + 1), all_moves):
        sleep(sleep_len)
        print(f'Move {itr}: {BLUE}{zero_loc}{END} <-> {RED}{move}{END}')
        board_str = ''
        for i, row in enumerate(board):
            board_str += '\t('
            for j, col in enumerate(row):
                if j != 0:
                    board_str += ', '
                if zero_loc == (i, j):
                    board_str += f'{BLUE}{col}{END}'
                elif move == (i, j):
                    board_str += f'{RED}{col}{END}'
                else:
                    board_str += f'{col}'
            board_str += ')\n'
        board = swap(board, zero_loc, move)
        print(board_str)
        zero_loc = move
    sleep(sleep_len)
    print(f'Done in {min_moves} moves:{GREEN}')
    for row in board:
        print(f'\t{row}')
    print(END)


def is_solveable(puzzle):
    '''determines if a given board is solveable depending on a set of rules.
    The factors include-
    length and width of the puzzle
    the inversion count of a puzzle
    the height of the zero from the bottom of the puzzle
    https://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html
    '''
    inversion_count = num_inversions(puzzle)
    # If the width is odd, then every solvable state has an even number of
    # inversions
    if len(puzzle) % 2 != 0 and len(puzzle[0]) % 2 != 0:
        return inversion_count % 2 == 0
    # If the width is even, then every solvable state has
    elif len(puzzle) % 2 == 1 or len(puzzle[0]) % 2 == 1:
        x, _ = find_zero(puzzle)
        zero_height = (x - 1) % 2
        if zero_height == 1:
            return inversion_count % 2 == 0
        else:
            return inversion_count % 2 == 1
    else:
        x, _ = find_zero(puzzle)
        zero_height = (x) % 2
        # an even number of inversions if the blank is on an odd numbered row
        # counting from the bottom
        if zero_height == 1:
            return inversion_count % 2 == 0
        # an odd number of inversions if the blank is on an even numbered row
        # counting from the bottom;
        else:
            return inversion_count % 2 == 1


def num_inversions(puzzle):
    '''calculates the number of inversions of a puzzle.
    This works by flattening the 2d puzzle arr into a 1d arr without
    the zero. Then for each number, we count the number of numbers that
    succeed it in the arr that are less than itself, and take the sum of
    all those'''
    # flatten the puzzle
    one_d_puzzle = []
    for arr in puzzle:
        one_d_puzzle += arr
    # get rid of the zero
    one_d_puzzle = [num for num in one_d_puzzle if num != 0]
    # for each number in the one d puzzle
    count = 0
    for i in range(len(one_d_puzzle)):
        # for each number succeeding the current number
        for j in range(i, len(one_d_puzzle)):
            # if the number is greater than the latter number
            if one_d_puzzle[i] > one_d_puzzle[j]:
                # add 1 to the inversion count
                count += 1
    return count


# Some random boards to chose from
solved_2x2 = (
    (1, 2),
    (3, 0)
)
easy_2x4 = (
    (6, 5, 2, 1),
    (0, 7, 3, 4)
)

reversed_2x4 = (
    (0, 7, 6, 5),
    (4, 3, 2, 1)
)

unsolveable_2x4 = (
    (7, 3, 6, 2),
    (0, 1, 4, 5)
)

medium_2x5 = (
    (3, 5, 1, 9, 0),
    (8, 2, 6, 7, 4)
)

unsolveable_2x5 = (
    (3, 5, 1, 9, 0),
    (8, 2, 6, 4, 7)
)

reversed_2x5 = (
    (0, 9, 8, 7, 6),
    (5, 4, 3, 2, 1)
)

easy_3x3 = (
    (1, 2, 4),
    (3, 7, 6),
    (5, 8, 0)
)

reversed_3x3 = (
    (0, 8, 7),
    (6, 5, 4),
    (3, 2, 1)
)

unsolveable_3x3 = (
    (0, 5, 4),
    (3, 8, 7),
    (6, 2, 1)
)

very_easy_3x4 = (
    (2, 3, 4, 0),
    (1, 6, 7, 8),
    (5, 9, 10, 11)
)

easy_3x4 = (
    (1, 2, 3, 4),
    (5, 11, 7, 8),
    (9, 6, 0, 10)
)

medium_3x4 = (
    (1, 3, 8, 2),
    (5, 11, 0, 7),
    (9, 6, 4, 10)
)

hard_3x4 = (
    (11, 5, 4, 10),
    (8, 3, 6, 7),
    (1, 9, 2, 0)
)

unsolveable_3x4 = (
    (1, 3, 2, 8),
    (5, 11, 0, 7),
    (9, 6, 4, 10)
)

medium_4x4 = (
    (4, 15, 11, 10),
    (8, 2, 9, 3),
    (1, 6, 5, 12),
    (7, 13, 14, 0)
)

unsolveable_4x4 = (
    (4, 7, 11, 10),
    (8, 2, 9, 3),
    (1, 6, 5, 12),
    (15, 13, 14, 0)
)

try_4x5 = (
    (3, 2, 12, 4, 10),
    (6, 8, 5, 15, 18),
    (9, 7, 1, 11, 13),
    (14, 19, 0, 17, 16)
)

rotated_4x5 = (
    (2, 3, 4, 5, 10),
    (1, 7, 8, 9, 15),
    (6, 12, 13, 14, 0),
    (11, 16, 17, 18, 19)
)

double_rotated_4x5 = (
    (3, 4, 5, 10, 15),
    (2, 7, 8, 9, 0),
    (1, 12, 13, 14, 19),
    (6, 11, 16, 17, 18)
)

try_5x5 = (
    (23, 19, 10, 3, 8),
    (0, 2, 24, 17, 16),
    (5, 14, 11, 21, 20),
    (22, 1, 6, 7, 12),
    (18, 15, 9, 13, 4)
)

if __name__ == '__main__':
    # change the value of board to use a different one from above
    board = medium_4x4
    min_moves, all_moves = optimized_solve(board)
    if min_moves == -1:
        print('This board is unsolveable.')
        for row in board:
            print(f'\t{row}')
    else:
        print(f'Minumum number of moves: {min_moves}')
        display_solution(board, min_moves, all_moves, sleep_len=0.5)
