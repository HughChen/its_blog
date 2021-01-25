inline void dense_tree_interactions_path_dependent(const TreeEnsemble& trees, const ExplanationDataset &data,
                                            tfloat *out_contribs,
                                            tfloat transform(const tfloat, const tfloat)) {

    // build a list of all the unique features in each tree
    int *unique_features = new int[trees.tree_limit * trees.max_nodes];
    std::fill(unique_features, unique_features + trees.tree_limit * trees.max_nodes, -1);
    for (unsigned j = 0; j < trees.tree_limit; ++j) {
        const int *features_row = trees.features + j * trees.max_nodes;
        int *unique_features_row = unique_features + j * trees.max_nodes;
        for (unsigned k = 0; k < trees.max_nodes; ++k) {
            for (unsigned l = 0; l < trees.max_nodes; ++l) {
                if (features_row[k] == unique_features_row[l]) break;
                if (unique_features_row[l] < 0) {
                    unique_features_row[l] = features_row[k];
                    break;
                }
            }
        }
    }
    
    // build an interaction explanation for each sample
    tfloat *instance_out_contribs;
    TreeEnsemble tree;
    ExplanationDataset instance;
    const unsigned contrib_row_size = (data.M + 1) * trees.num_outputs;
    tfloat *diag_contribs = new tfloat[contrib_row_size];
    tfloat *on_contribs = new tfloat[contrib_row_size];
    tfloat *off_contribs = new tfloat[contrib_row_size];
    for (unsigned i = 0; i < data.num_X; ++i) {
        instance_out_contribs = out_contribs + i * (data.M + 1) * contrib_row_size;
        data.get_x_instance(instance, i);

        // aggregate the effect of explaining each tree
        // (this works because of the linearity property of Shapley values)
        std::fill(diag_contribs, diag_contribs + contrib_row_size, 0);
        for (unsigned j = 0; j < trees.tree_limit; ++j) {
            trees.get_tree(tree, j);
            tree_shap(tree, instance, diag_contribs, 0, 0);

            const int *unique_features_row = unique_features + j * trees.max_nodes;
            for (unsigned k = 0; k < trees.max_nodes; ++k) {
                const int ind = unique_features_row[k];
                if (ind < 0) break; // < 0 means we have seen all the features for this tree

                // compute the shap value with this feature held on and off
                std::fill(on_contribs, on_contribs + contrib_row_size, 0);
                std::fill(off_contribs, off_contribs + contrib_row_size, 0);
                tree_shap(tree, instance, on_contribs, 1, ind);
                tree_shap(tree, instance, off_contribs, -1, ind);

                // save the difference between on and off as the interaction value
                for (unsigned l = 0; l < contrib_row_size; ++l) {
                    const tfloat val = (on_contribs[l] - off_contribs[l]) / 2;
                    instance_out_contribs[ind * contrib_row_size + l] += val;
                    diag_contribs[l] -= val;
                }
            }
        }

        // set the diagonal
        for (unsigned j = 0; j < data.M + 1; ++j) {
            const unsigned offset = j * contrib_row_size + j * trees.num_outputs;
            for (unsigned k = 0; k < trees.num_outputs; ++k) {
                instance_out_contribs[offset + k] = diag_contribs[j * trees.num_outputs + k];
            }
        }

        // apply the base offset to the bias term
        const unsigned last_ind = (data.M * (data.M + 1) + data.M) * trees.num_outputs;
        for (unsigned j = 0; j < trees.num_outputs; ++j) {
            instance_out_contribs[last_ind + j] += trees.base_offset[j];
        }
    }

    delete[] diag_contribs;
    delete[] on_contribs;
    delete[] off_contribs;
    delete[] unique_features;