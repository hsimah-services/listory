<?php

declare(strict_types=1);
require dirname(__DIR__) . '/bootstrap.php';

use Listory\Standalone\{Application, GraphQL, Viewer, Schema};
use Eleph\SQLite\Database;

function check(bool $condition, string $message): void { if (!$condition) throw new RuntimeException($message); }
function fails(callable $fn, string $message): void {
    try { $fn(); } catch (Throwable) { return; }
    throw new RuntimeException($message);
}
$db = new Database(':memory:');
Schema::install($db);
$app = new Application($db, new Viewer('1', 'editor'));

GraphQL::schema($app)->assertValid();
echo "PASS: schema is valid\n";

$schema = GraphQL::schema($app);
function gql(string $query, array $variables = []): array {
    global $schema;
    $result = \GraphQL\GraphQL::executeQuery($schema, $query, variableValues: $variables)->toArray(3);
    if (isset($result['errors'])) throw new RuntimeException(json_encode($result['errors']));
    return $result['data'];
}

$list = gql('mutation($title:String!){createListoryList(input:{title:$title}){listoryList{id}}}', ['title' => 'Groceries'])['createListoryList']['listoryList'];
check($list['id'] !== '', 'Create returns an id');
echo "PASS: create a list\n";
$listId = $list['id'];

foreach (['Milk', 'Bread'] as $name) {
    gql('mutation($name:String!,$list:ID){createListoryListItem(input:{name:$name,list:$list}){listoryListItem{id}}}', ['name' => $name, 'list' => $listId]);
}
echo "PASS: create list items\n";

$node = gql('query($id:ID!){node(id:$id){id ... on ListoryList { title items { totalCount nodes { name } } }}}', ['id' => $listId])['node'];
check($node['title'] === 'Groceries', 'Node reads the list title');
check($node['items']['totalCount'] === 2, 'Nested items count is 2');
check(count($node['items']['nodes']) === 2, 'Nested items returns 2 nodes');
echo "PASS: read nested\n";

$checklistId = gql('mutation($title:String!,$lists:[ID]){createListoryChecklist(input:{title:$title,sourceLists:$lists}){listoryChecklist{id}}}', ['title' => 'Weekly shop', 'lists' => [$listId]])['createListoryChecklist']['listoryChecklist']['id'];
$checklistItems = gql('query($id:ID!){listoryChecklist(id:$id){items{totalCount nodes{id name checked}}}}', ['id' => $checklistId])['listoryChecklist']['items'];
check($checklistItems['totalCount'] === 2, 'A checklist built from a list has 2 items');
check(array_reduce($checklistItems['nodes'], fn (bool $all, array $item) => $all && $item['checked'] === false, true), 'Copied items are unchecked');
echo "PASS: create a checklist from lists\n";

$checklist = gql('query($id:ID!){listoryChecklist(id:$id){completedAt}}', ['id' => $checklistId])['listoryChecklist'];
check($checklist['completedAt'] === null, 'Checklist starts incomplete');
foreach ($checklistItems['nodes'] as $item) {
    gql('mutation($id:ID!){updateListoryChecklistItem(input:{id:$id,checked:true}){listoryChecklistItem{id}}}', ['id' => $item['id']]);
}
$checklist = gql('query($id:ID!){listoryChecklist(id:$id){completedAt}}', ['id' => $checklistId])['listoryChecklist'];
check($checklist['completedAt'] !== null, 'Checking every item sets completedAt');
echo "PASS: check an item\n";

foreach (['Cafe', 'Hardware', 'Pharmacy'] as $title) {
    gql('mutation($title:String!){createListoryList(input:{title:$title}){listoryList{id}}}', ['title' => $title]);
}
$page = gql('{listoryLists(first:2){totalCount pageInfo{hasNextPage}}}')['listoryLists'];
check($page['pageInfo']['hasNextPage'] === true, 'First page of two lists reports a next page');
echo "PASS: pagination\n";

fails(fn () => gql('query($id:ID!){listoryChecklist(id:$id){id}}', ['id' => $listId]), 'A ListoryList id is rejected by listoryChecklist');
echo "PASS: wrong id type rejected\n";

$search = 'query($term:String){listoryListSearch(where:{term:$term}){totalCount nodes{title}}}';
foreach (['Garden', 'Camping', '100% done'] as $title) {
    gql('mutation($title:String!){createListoryList(input:{title:$title}){listoryList{id}}}', ['title' => $title]);
}
$ga = gql($search, ['term' => 'ga'])['listoryListSearch'];
check($ga['totalCount'] === 1 && array_column($ga['nodes'], 'title') === ['Garden'], 'Searching "ga" finds only Garden');
echo "PASS: list search by title\n";

$percent = gql($search, ['term' => '100%'])['listoryListSearch'];
check(array_column($percent['nodes'], 'title') === ['100% done'], 'Searching "100%" finds the literal title');
$wildcard = gql($search, ['term' => '%'])['listoryListSearch'];
check($wildcard['totalCount'] === 1 && array_column($wildcard['nodes'], 'title') === ['100% done'], 'Searching "%" matches only the literal percent sign');
echo "PASS: literal wildcards\n";

$firstTwo = gql('{listoryListSearch(first:2){totalCount pageInfo{hasNextPage} nodes{title}}}')['listoryListSearch'];
check(array_column($firstTwo['nodes'], 'title') === ['100% done', 'Cafe'], 'Search pages in case-insensitive title order');
check($firstTwo['pageInfo']['hasNextPage'] === true, 'First page of search reports a next page');
echo "PASS: search ordering and paging\n";

gql('mutation($title:String!,$lists:[ID]){createListoryChecklist(input:{title:$title,sourceLists:$lists}){listoryChecklist{id}}}', ['title' => 'Trip prep', 'lists' => [$listId]]);
$checklistSearch = 'query($completed:Boolean){listoryChecklistSearch(where:{completed:$completed}){totalCount}}';
$done = gql($checklistSearch, ['completed' => true])['listoryChecklistSearch']['totalCount'];
$open = gql($checklistSearch, ['completed' => false])['listoryChecklistSearch']['totalCount'];
$everything = gql($checklistSearch, ['completed' => null])['listoryChecklistSearch']['totalCount'];
check($done === 1 && $open === 1 && $everything === 2, 'Checklist completed filter returns 1 complete, 1 active and 2 in total');
echo "PASS: checklist completed filter\n";
